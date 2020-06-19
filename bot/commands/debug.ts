import { outdent } from 'outdent';

import { database } from '../database';
import { format } from '../utils/formatters';
import { Messages } from '../services/messages';
import { CONFIG } from '../config';
import { CommandRegistrator } from './types';
import { MessageTable } from '../services/table';

/**
 * Retrieves info about the bot!
 */
export const info: CommandRegistrator = (bot) => {
  bot.command('info', async ({ message }) => {
    await message.reply(outdent`
      Here's all my personal details, Senpai!

      ${format(outdent`
        ${format('General').header.value}

          ID: ${bot.id}
          Name: ${bot.name}
          Version: ${CONFIG.VERSION}

        ${bot.voice.isConnected ? outdent`
          ${format('Voice').header.value}

            Channel: ${bot.voice.channelName}
            Members: ${bot.voice.members?.keyArray().length}
        ` : outdent`
          ${format('Voice').header.value} - Not Connected...
        `}
      `).code({ multi: true }).value}
    `);
  }).help({
    name: 'info',
    description: 'Retrieves a bunch of info about the bot.',
    group: 'Debug',
  })
}

/**
 * Queries the database for information.
 */
export const query: CommandRegistrator = (bot) => {
  bot.command('query <...sql>', async ({ message, args }) => {
    if (!['203949397271117824'].includes(message.author.id)) {
      return await message.reply(Messages.FORBIDDEN);
    }

    const { db } = await database();

    const [data] = await db.query(args.sql);

    if (data.length === 0) {
      if (args.sql.match(/^delete/i)) {
        return await message.reply(outdent`
          Rows deleted successfully!
        `);
      } else if (args.sql.match(/^update/i)) {
        return await message.reply(outdent`
          Rows updated successfully!
        `);
      } else if (args.sql.match(/^drop/i)) {
        return await message.reply(outdent`
          Table dropped successfully!
        `);
      }

      return await message.reply(outdent`
        No results found for... (${args.sql})
      `);
    }

    const table = new MessageTable(Object.keys(data[0]));
    table.rows(data.map((row: any) => Object.values(row)));

    await message.reply(outdent`
      Results found for... (${args.sql})

      ${format(table.toString()).code({ multi: true, type: 'prolog' }).value}
    `);
  }).help({
    name: 'query',
    description: 'Queries the database for information.',
    group: 'Debug',
    args: {
      sql: 'The sql to execute.',
    },
  });
}
