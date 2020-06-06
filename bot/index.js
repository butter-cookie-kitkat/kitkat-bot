import 'dotenv/config';

import { DiscordBot, CommonCommands } from './core';

import { Messages } from './services/messages';

import { outdent } from 'outdent';
import { commands } from './commands';
import { Songs } from './services/songs';
import { announcements } from './announcements';

import * as Loggers from './utils/loggers';

const bot = new DiscordBot({
  token: process.env.DISCORD_TOKEN,
  prefix: '.',
});

bot.on('command:before', ({ message, args }) => {
  Loggers.messages(`Author: ${message.member.displayName}; Contents: ${message.content}; Args: ${JSON.stringify(args)}`);
});

bot.voice.on('start', async ({ uri }) => {
  const song = await Songs.get(uri);

  if (!song) return;

  await bot.text.send(song.channelID, outdent`
  \`${song.title}\` is now playing!
`);
});

bot.voice.on('finish', async ({ uri, canceled }) => {
  Loggers.music(`Finished playing, "${uri}".`);

  if (canceled) return;

  await Songs.remove(uri);

  const currentSong = await Songs.current();

  if (!currentSong) return;

  await bot.voice.play(currentSong.url);
});

bot.on('error', async ({ message, error }) => {
  Loggers.main(error);

  if (process.env.NOTIFICATIONS_CHANNEL_ID) {
    await bot.text.send(process.env.NOTIFICATIONS_CHANNEL_ID, outdent`
      We encountered an error while processing the following commmand.

      **Author**: ${message.author.username}
      **Command**: \`${message.content}\`
      **Message**: \`${error.message}\`

      **~-~-~-~ Stack Trace ~-~-~-~**

      \`\`\`
      ${error.stack}
      \`\`\`
    `);
  }

  await message.channel.send(Messages.UNHANDLED_ERROR);
});

bot.login().then(async () => {
  Loggers.main('Authentication Successful!');

  await bot.status.set(`Use .help`);

  if (!process.env.IS_LIVE) {
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

    const channel = await bot.text.channel(process.env.ANNOUNCEMENTS_CHANNEL_ID);

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
