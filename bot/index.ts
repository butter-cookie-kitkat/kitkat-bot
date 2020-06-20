import 'dotenv/config';
import { DiscordBot, CommonCommands } from '@butter-cookie-kitkat/discord-core';
import { outdent } from 'outdent';

import { AUTO_LEAVE_DEBOUNCE } from './constants';

import { DEBUG_MESSAGES } from './services/messages';

import { commands } from './commands';
import { service as SongsService } from './services/songs';
import { announcements } from './announcements';

import * as Loggers from './utils/loggers';
import { debounce } from './utils/debounce';
import { CONFIG } from './config';
import { batch_jobs } from './batch';
import { service as Announcements } from './services/announcements';
import { MessageEmbed } from 'discord.js';
import { KitkatBotCommandError } from './types';
import { embeds } from './utils/embeds';
import { duration } from './utils/duration';

const bot = new DiscordBot({
  token: CONFIG.DISCORD_TOKEN,
  prefix: '.',
});

bot.on('command:before', ({ message, args }) => {
  Loggers.messages(`Author: ${message.author.username}#${message.author.discriminator}; Contents: ${message.content}; Args: ${JSON.stringify(args)}`);
});

bot.voice.on('start', async ({ uri }) => {
  const song = await SongsService.get(uri);

  if (!song) return;

  debounce.clear(AUTO_LEAVE_DEBOUNCE);

  await bot.text.send(song.channelID, embeds.success({
    title: ['Music', 'Now Playing'],
    fields: [{
      name: 'Title',
      value: `[${song.title}](${song.url})`,
      inline: true,
    }, {
      name: 'Duration',
      value: duration.humanize(song.duration),
      inline: true,
    }],
  }));
});

bot.voice.on('finish', async ({ uri, interrupted }) => {
  Loggers.music(`Finished playing, '${uri}'.`);

  if (interrupted) return;

  await SongsService.remove(uri);

  const currentSong = await SongsService.current();

  if (currentSong) {
    await bot.voice.play(currentSong.url);
  } else {
    debounce.start(AUTO_LEAVE_DEBOUNCE, async () => {
      Loggers.music(DEBUG_MESSAGES.AUTO_LEAVE('Idle for too long'));

      await bot.voice.leave();
    });
  }
});

bot.voice.on('member:leave', () => {
  const hasMembers = bot.voice.members && bot.voice.members.some((member) => member.id !== bot.id);

  if (hasMembers) return;

  Loggers.music(DEBUG_MESSAGES.AUTO_LEAVE('No members remaining'));
  bot.voice.leave();
});

bot.voice.on('leave', SongsService.clear);

bot.on('error', async ({ message, error }) => {
  if (error instanceof KitkatBotCommandError) {
    await message.channel.send(embeds.failure({
      description: error.message,
      fields: error.embedOptions.fields,
    }));
  } else {
    Loggers.main(error);

    if (CONFIG.NOTIFICATIONS_CHANNEL_ID) {
      await bot.text.send(CONFIG.NOTIFICATIONS_CHANNEL_ID, embeds.error(error, message));
    }
  }
});

bot.login().then(async () => {
  Loggers.main('Authentication Successful!');

  await bot.status.set(`Use .help`);

  if (!CONFIG.IS_LIVE) {
    await bot.status.offline();
    Loggers.main(`Beep! Boop! I'm hiding from you!`);
  }

  Loggers.commands(`Setting up commands...`);
  CommonCommands.help(bot);
  commands.forEach((commands) => Object.entries(commands).forEach(([name, command]) => {
    command(bot);
    Loggers.commands(`New command connected successfully! (${name})`);
  }));

  Loggers.main(`Setup complete, ready for input!`);

  if (CONFIG.ANNOUNCEMENTS_CHANNEL_ID !== null) {
    const { ANNOUNCEMENTS_CHANNEL_ID } = CONFIG;

    await Promise.all(announcements.map(async (job) => {
      const info = await job();

      const announcement = await Announcements.get(info.marker);

      const channel = await bot.text.channel(ANNOUNCEMENTS_CHANNEL_ID);

      if (announcement && announcement.message_id) {
        const message = await channel.messages.fetch(announcement.message_id);

        await message.edit(info.message);
      } else {
        const message = await channel.send(info.message);

        await Announcements.save({
          message_id: message.id,
          marker: info.marker,
        });
      }
    }));
  }

  Loggers.main(`Executing batch jobs...`);

  await Promise.all(Object.entries(batch_jobs).map(async ([name, job]) => {
    try {
      Loggers.main(`Executing batch job... (${name})`);
      await job();
      Loggers.main(`Successfully executed batch job! (${name})`);
    } catch (error) {
      Loggers.main(`Failed to execute batch job! (${name})`);
      Loggers.main(error);
    }
  }));
});

([
  'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
  'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM',
] as NodeJS.Signals[]).forEach((sig) => {
  process.on(sig, () => {
    if (bot.voice.isConnected) {
      bot.voice.leave().then(() => {
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});
