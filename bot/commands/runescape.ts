import { outdent } from 'outdent';

import { RS3, OSRS, Response } from '../services/runescape';
import { CommandRegistrator } from './types';
import { table } from '../services/table';
import { embeds } from '../utils/embeds';

function CreateTable({ columns, results }: Response) {
  return table(columns).rows(results.map((result) => Object.values(result))).toString({
    truncate: 1900,
  });
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

    await message.channel.send(embeds.success({
      title: ['Runescape', `GE (${args.name})`],
      description: `Here's your Grand Exchange info, Senpai!`,
    }));

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
