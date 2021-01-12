import { database } from '../database';
import { format } from '../utils/formatters';
import { intl } from '../services/intl';
import { CONFIG } from '../config';
import { CommandRegistrator } from './types';
import { table } from '../utils/table';
import { KitkatBotCommandError } from '../types';
import { embeds } from '../utils/embeds';
import { EmbedField } from 'discord.js';

/**
 * Retrieves info about the bot!
 */
export const info: CommandRegistrator = (bot) => {
  bot.command('info', async ({ message }) => {
    const fields: EmbedField[] = [{
      name: 'ID',
      value: bot.id ? bot.id : 'Unknown',
      inline: true,
    }, {
      name: 'Name',
      value: bot.name ? bot.name : 'Unknown',
      inline: true,
    }];

    await message.channel.send(embeds.success({
      title: `Bot Status (v${CONFIG.VERSION})`,
      description: `Here's all my personal details, Senpai!`,
      fields: fields,
    }));
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
  bot.command('sql <...query>', async ({ message, args }) => {
    if (!['203949397271117824'].includes(message.author.id)) {
      throw new KitkatBotCommandError(intl('FORBIDDEN'));
    }

    const { db } = await database(true);

    try {
      const [data] = await db.query(args.query);

      if (data.length === 0) {
        if (args.query.match(/^delete/i)) {
          return message.channel.send(embeds.success({
            title: ['SQL', 'Success!'],
            description: 'Rows deleted successfully!',
          }));
        } else if (args.query.match(/^update/i)) {
          return message.channel.send(embeds.success({
            title: ['SQL', 'Success!'],
            description: 'Rows updated successfully!',
          }));
        } else if (args.query.match(/^drop/i)) {
          return message.channel.send(embeds.success({
            title: ['SQL', 'Success!'],
            description: 'Table dropped successfully!',
          }));
        }

        return message.channel.send(embeds.success({
          title: ['SQL', 'Success!'],
          description: `No results found for... (${args.query})`,
        }));
      }

      const headers = Object.keys((data[0] as any).toString());
      const rows: any[][] = data.map((row: any) => Object.values(row));

      const output = table(headers).rows(rows).toString({ truncate: 2000 });
      const VISIBLE_ROW_COUNT = output.split('\n').length - 5;

      await message.channel.send(embeds.success({
        title: ['SQL', 'Success!'],
        fields: [{
          name: 'SQL',
          value: format(args.query).code().toString(),
          inline: false,
        }, {
          name: 'Row Count',
          value: rows.length.toString(),
          inline: true,
        }, {
          name: 'Visible Row Count',
          value: VISIBLE_ROW_COUNT.toString(),
          inline: true,
        }],
      }));

      return message.channel.send(format(output).code({ multi: true, type: 'sql' }).toString());
    } catch (error) {
      if (error.name === 'SequelizeDatabaseError') {
        throw new KitkatBotCommandError({
          description: 'Whoops! Looks like that sql was malformed, better check it again!',
          fields: [{
            name: 'Query',
            value: format(args.query).code({ multi: true, type: 'sql' }).toString(),
            inline: false,
          }],
        });
      }

      throw error;
    }
  }).help({
    name: 'sql',
    description: 'Queries the database for information.',
    group: 'Debug',
    args: {
      query: 'The query to execute.',
    },
  });
}
