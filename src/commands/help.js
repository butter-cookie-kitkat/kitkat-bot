import outdent from 'outdent';
import { HelpFormatter } from '../utils/help';
import { FindCommand } from '../utils/commands';

export const help = {
  name: 'help',
  aliases: ['halp'],
  args: {
    command: 'Quick help on <command>',
  },
  description: 'Display a list of the available commands.',
  exec: async ({ message }, args) => {
    const { commands, order, groups } = await import('./index.js');

    const [, name] = args._;
    const command = FindCommand(commands, name);

    if (command) {
      await message.reply(outdent`
        Here's some information about that command!

        ${HelpFormatter.command(command, true)}
      `);
    } else {
      await message.reply(outdent`
        Here's a list of the available commands!

        ${order.map((name) => HelpFormatter.group(name, groups[name])).join('\r\n\r\n')}
      `);
    }
  },
};

export default [
  help,
];
