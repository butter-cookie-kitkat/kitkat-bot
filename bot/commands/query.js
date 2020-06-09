import AsciiTable from 'ascii-table';
import { outdent } from 'outdent';

import { DiscordBot } from 'kitkat-bot-core';
import { database } from '../database';
import { format } from '../utils/formatters';
import { Messages } from '../services/messages';

/**
 * Adds a song to the queue.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function query(bot) {
  bot.command('query <...sql>', async ({ message, args }) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
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
      }

      return await message.reply(outdent`
        No results found for... (${args.sql})
      `);
    }

    const table = new AsciiTable();
    table.setHeading(...Object.keys(data[0]));
    data.forEach((row) => table.addRow(...Object.values(row)));

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
