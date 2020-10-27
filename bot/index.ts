import 'dotenv/config';
import { DiscordBot } from '@butter-cookie-kitkat/discord-core';

import { intl } from './services/intl';

import { commands } from './commands';
import { announcements } from './announcements';

import * as Loggers from './utils/loggers';
import { CONFIG } from './config';
import { batch_jobs } from './batch';
import { service as Announcements } from './services/announcements';
import { KitkatBotCommandError } from './types';
import { embeds } from './utils/embeds';

const bot = new DiscordBot({
  token: CONFIG.DISCORD_TOKEN,
  prefix: '.',
});

bot.on('command:before', ({ message, args }) => {
  Loggers.messages(`Author: ${message.author.username}#${message.author.discriminator}; Contents: ${message.content}; Args: ${JSON.stringify(args)}`);
});

bot.on('error', async ({ message, error }) => {
  if (error instanceof KitkatBotCommandError) {
    await message.channel.send(embeds.failure({
      description: error.message,
      fields: error.embedOptions.fields,
    }));
  } else {
    Loggers.main(error);

    if (CONFIG.NOTIFICATIONS_CHANNEL_ID) {
      await Promise.all([
        bot.text.send(CONFIG.NOTIFICATIONS_CHANNEL_ID, embeds.error(error, message)),
        message.channel.send(embeds.failure({
          description: intl('UNHANDLED_ERROR', {
            reason: 'No members remaining',
          }),
        })),
      ]);
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
  commands.forEach((commands) => Object.entries(commands).forEach(([name, command]) => {
    command(bot);
    Loggers.commands(`New command connected successfully! (${name})`);
  }));

  Loggers.main(`Setup complete, ready for input!`);

  if (CONFIG.ANNOUNCEMENTS_CHANNEL_ID !== null) {
    const { ANNOUNCEMENTS_CHANNEL_ID } = CONFIG;

    Loggers.main(`Executing Announcements!`);

    await Promise.all(announcements.map(async (job) => {
      const info = await job();

      const announcement = await Announcements.get(info.marker);

      const channel = await bot.text.channel(ANNOUNCEMENTS_CHANNEL_ID);

      const message = announcement ? await channel.messages.fetch(announcement.message_id).catch(() => null) : null;

      if (message) {
        Loggers.main(`Existing Message Found, editing...`);

        await message.edit(info.message);
      } else {
        Loggers.main(`Message not found, sending new message...`);

        const message = await channel.send(info.message);

        await Announcements.save({
          message_id: message.id,
          marker: info.marker,
        });
      }

      Loggers.main(`Announcement complete!`);
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
    process.exit(0);
  });
});
