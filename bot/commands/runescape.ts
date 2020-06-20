import { outdent } from 'outdent';

import { RS3, OSRS, Response } from '../services/runescape';
import { CommandRegistrator } from './types';
import { table } from '../utils/table';
import { embeds } from '../utils/embeds';
import { KitkatBotCommandError } from '../types';

function CreateTable({ columns, results }: Response): (null|string) {
  if (results.length === 0) {
    return null;
  }

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
      RS3.search(args.name).then(CreateTable),
      OSRS.search(args.name).then(CreateTable),
    ]);

    if (!rs3 && !osrs) {
      throw new KitkatBotCommandError(`No Item exists with that name. (${args.name})`);
    }

    await message.channel.send(embeds.success({
      title: ['Runescape', `GE (${args.name})`],
      description: `Here's your Grand Exchange info, Senpai!`,
    }));

    if (rs3) {
      await message.channel.send(outdent`
        **RuneScape 3**
        \`\`\`
        ${rs3}
        \`\`\`
      `);
    }

    if (osrs) {
      await message.channel.send(outdent`
        **OldSchool RuneScape**
        \`\`\`
        ${osrs}
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
