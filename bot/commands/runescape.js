import AsciiTable from 'ascii-table';
import { outdent } from 'outdent';

import { DiscordBot } from 'kitkat-bot-core';
import { RS3, OSRS } from '../services/runescape';

// eslint-disable-next-line jsdoc/require-jsdoc
function CreateTable({ columns, results }) {
  const table = new AsciiTable();
  table.setHeading(...columns);

  for (const result of results.slice(0, 10)) {
    table.addRow(...Object.values(result));
  }

  return table.toString();
}

/**
 * Adds a song to the queue.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function ge(bot) {
  bot.command('ge <...name>', async ({ message, args }) => {
    const [rs3, osrs] = await Promise.all([
      RS3.search(args.name),
      OSRS.search(args.name),
    ]);

    await message.reply(outdent`
      Here's the current price of all items matching "${args.name}" on the Grand Exchange!
    `);

    if (rs3.results.length > 0) {
      await message.channel.send(outdent`
        **RuneScape 3**
        \`\`\`
        ${CreateTable(rs3)}
        \`\`\`
      `);
    }

    if (osrs.results.length > 0) {
      await message.channel.send(outdent`
        **OldSchool RuneScape**
        \`\`\`
        ${CreateTable(osrs)}
        \`\`\`
      `);
    }
  }).help({
    name: 'ge',
    description: 'Searches the GE for a given item in RS3 and OSRS',
    group: 'RuneScape',
    args: {
      name: 'The item name.',
    },
  });
}
