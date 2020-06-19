import { outdent } from 'outdent';

import { RS3, OSRS, Response } from '../services/runescape';
import { CommandRegistrator } from './types';
import { MessageTable } from '../services/table';

function CreateTable({ columns, results }: Response) {
  const table = new MessageTable(columns);

  table.rows(results.slice(0, 5).map((result) => Object.values(result)));

  return table.toString();
}

/**
 * Looks up an item in the GE.
 */
export const ge: CommandRegistrator = (bot) => {
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
