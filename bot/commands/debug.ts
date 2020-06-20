import { outdent } from 'outdent';

import { database } from '../database';
import { format } from '../utils/formatters';
import { Messages } from '../services/messages';
import { CONFIG } from '../config';
import { CommandRegistrator } from './types';
import { MessageTable } from '../services/table';
import { KitkatBotCommandError } from '../types';

/**
 * Retrieves info about the bot!
 */
export const info: CommandRegistrator = (bot) => {
  bot.command('info', async ({ message }) => {
    await message.reply(outdent`
      Here's all my personal details, Senpai!

      ${format(outdent`
        ${format('General').header}

          ID: ${bot.id}
          Name: ${bot.name}
          Version: ${CONFIG.VERSION}

        ${bot.voice.isConnected ? outdent`
          ${format('Voice').header}

            Channel: ${bot.voice.channelName}
            Members: ${bot.voice.members ? bot.voice.members.keyArray().length : 0}
        ` : outdent`
          ${format('Voice').header} - Not Connected...
        `}
      `).code({ multi: true })}
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
export const sql: CommandRegistrator = (bot) => {
  bot.command('sql <...sql>', async ({ message, args }) => {
    if (!['203949397271117824'].includes(message.author.id)) {
      throw new KitkatBotCommandError(Messages.FORBIDDEN);
    }

    const { db } = await database(true);

    try {
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

        ${format(table.toString()).code({ multi: true, type: 'prolog' })}
      `);
    } catch (error) {
      if (error.name === 'SequelizeDatabaseError') {
        throw new KitkatBotCommandError(outdent`
          Whoops! Looks like that sql was malformed, better check it again!
        `, {
          fields: [{
            name: 'Query',
            value: format(args.sql).code({ multi: true, type: 'sql' }).toString(),
            inline: false,
          }],
        });
      } else if (error.code === 50035) {
        throw new KitkatBotCommandError(outdent`
          Whoa Senpai, no need to be so pushy. Maybe you should limit your row count!
        `);
      }

      throw error;
    }
  }).help({
    name: 'sql',
    description: 'Queries the database for information.',
    group: 'Debug',
    args: {
      sql: 'The sql to execute.',
    },
  });
}
