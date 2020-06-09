import 'dotenv/config';
import { outdent } from 'outdent';

import { AUTO_LEAVE_DEBOUNCE } from './constants';
import { DiscordBot, CommonCommands } from './core';

import { Messages, DEBUG_MESSAGES } from './services/messages';

import { commands } from './commands';
import { Songs } from './services/songs';
import { announcements } from './announcements';

import * as Loggers from './utils/loggers';
import { Debounce } from './utils/debounce';
import { format } from './utils/formatters';
import { CONFIG } from './config';

const bot = new DiscordBot({
  token: CONFIG.DISCORD_TOKEN,
  prefix: '.',
});

bot.on('command:before', ({ message, args }) => {
  Loggers.messages(`Author: ${message.member.displayName}; Contents: ${message.content}; Args: ${JSON.stringify(args)}`);
});

bot.voice.on('start', async ({ uri }) => {
  const song = await Songs.get(uri);

  if (!song) return;

  Debounce.clear(AUTO_LEAVE_DEBOUNCE);
  await bot.text.send(song.channelID, outdent`
    \`${song.title}\` is now playing!
  `);
});

bot.voice.on('finish', async ({ uri, canceled }) => {
  Loggers.music(`Finished playing, "${uri}".`);

  if (canceled) return;

  await Songs.remove(uri);

  const currentSong = await Songs.current();

  if (currentSong) {
    await bot.voice.play(currentSong.url);
  } else {
    Debounce.start(AUTO_LEAVE_DEBOUNCE, async () => {
      Loggers.music(DEBUG_MESSAGES.AUTO_LEAVE('Idle for too long'));

      await bot.voice.leave();
    });
  }
});

bot.voice.on('member:leave', () => {
  const hasMembers = bot.voice.members.some((member) => member.id !== bot.id);

  if (hasMembers) return;

  Loggers.music(DEBUG_MESSAGES.AUTO_LEAVE('No members remaining'));
  bot.voice.leave();
});

bot.voice.on('leave', Songs.clear);

bot.on('error', async ({ message, error }) => {
  Loggers.main(error);

  if (CONFIG.NOTIFICATIONS_CHANNEL_ID) {
    await bot.text.send(CONFIG.NOTIFICATIONS_CHANNEL_ID, outdent`
      We encountered an error while processing the following commmand.

      ${format('Author').bold.value}: ${message.author.username}
      ${format('Command').bold.value}: ${message.content}
      ${format('Message').bold.value}: ${error.message}

      ${format('~-~-~-~ Stack Trace ~-~-~-~').bold.value}

      ${format(error.stack).code({ multi: true }).value}
    `);
  }

  await message.channel.send(Messages.UNHANDLED_ERROR);
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

  await Promise.all(announcements.map(async (announcement) => {
    const info = await announcement();

    const channel = await bot.text.channel(CONFIG.ANNOUNCEMENTS_CHANNEL_ID);

    const messages = await channel.messages.fetch();

    const message = messages.find((message) => message.author.id === bot.id && message.content.includes(info.marker));

    const content = outdent`
      ${info.message}

      \`${info.marker}\`
    `;

    if (message) {
      await message.edit(content);
    } else {
      await channel.send(content);
    }
  }));
});
