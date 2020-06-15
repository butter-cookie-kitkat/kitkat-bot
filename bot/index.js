import 'dotenv/config';
import { DiscordBot, CommonCommands } from 'kitkat-bot-core';
import { outdent } from 'outdent';

import { AUTO_LEAVE_DEBOUNCE } from './constants';

import { Messages, DEBUG_MESSAGES } from './services/messages';

import { commands } from './commands';
import { Songs } from './services/songs';
import { announcements } from './announcements';

import * as Loggers from './utils/loggers';
import { Debounce } from './utils/debounce';
import { format } from './utils/formatters';
import { math } from './utils/math';
import { CONFIG } from './config';
import { worker as xivapi_worker } from './workers/xivapi';
import { database } from './database';
import { Arrays } from './utils/arrays';

const bot = new DiscordBot({
  token: CONFIG.DISCORD_TOKEN,
  prefix: '.',
});

bot.on('command:before', ({ message, args }) => {
  Loggers.messages(`Author: ${message.author.username}#${message.author.discriminator}; Contents: ${message.content}; Args: ${JSON.stringify(args)}`);
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

      ${format('Author').bold.value}: ${message.author.username}#${message.author.discriminator}
      ${format('Command').bold.value}: ${message.content}
      ${format('Message').bold.value}: ${error.message}

      ${format('~-~-~-~ Stack Trace ~-~-~-~').bold.value}

      ${format(error.stack).code({ multi: true }).value}
    `);
  }

  await message.channel.send(Messages.UNHANDLED_ERROR);
});

xivapi_worker.run().then(async (info) => {
  Loggers.workers(`Generating chunks from rows... (${info.length})`);

  const CHUNK_SIZE = 100;

  const chunks = Arrays.chunk(info.map((gatheringInfo) => {
    const nodes = gatheringInfo.location.nodes || [];

    const { x, y, z } = nodes.reduce((output, node) => {
      output.x.push(node.pos_x);
      output.y.push(node.pos_y);
      output.z.push(node.pos_z);

      return output;
    }, { x: [], y: [], z: [] });

    return {
      id: gatheringInfo.id,
      name: gatheringInfo.name,
      hidden: gatheringInfo.hidden,
      type: gatheringInfo.type,
      map_image: gatheringInfo.location.map_image,
      zone: gatheringInfo.location.zone,
      region: gatheringInfo.location.region,
      place: gatheringInfo.location.place,
      x: math.center(...x),
      y: math.center(...y),
      z: math.center(...z),
    };
  }), CHUNK_SIZE);

  Loggers.workers(`Chunks generated successfully! (${chunks.length})`);

  const { gathering } = await database();

  Loggers.workers('Destroying old rows!');

  await gathering.destroy({
    truncate: true,
  });

  for (let i = 0; i < chunks.length; i++) {
    const rows = chunks[i];
    const range = `${i * CHUNK_SIZE}-${i * CHUNK_SIZE + rows.length}`;

    Loggers.workers(`Saving Gathering Info Rows... (${range})`);

    try {
      await gathering.bulkCreate(rows);
    } catch (error) {
      console.log(rows.map((row) => row.id));
      throw error;
    }

    Loggers.workers(`Successfully saved gathering rows! (${range})`);
  }

  Loggers.workers(`Finished dumping gathering info!`);
}).catch((error) => {
  Loggers.workers(error);
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
