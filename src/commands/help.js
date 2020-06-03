import outdent from 'outdent';
import { concat } from '../utils/concat';

function formatExample(name, args) {
  const example = concat(
    `.${name}`,
    ...Object.entries(args).filter(([, arg]) => arg.positional).map(([name]) => `<${name}>`),
  );

  return `\`${example}\``;
}

function formatGroup({ name, commands }) {
  const filteredCommands = commands.filter((command) => !command.hidden);

  if (name === '.') {
    return filteredCommands.map((command) => formatCommand(command)).join('\r\n');
  }

  return outdent`
    **${name}**

      ${filteredCommands.map((command) => formatCommand(command)).join('\r\n  ')}
  `;
}

function formatCommand({ name, args, description }) {
  return `${formatExample(name, args)} - ${description}`;
}

export const help = {
  name: 'help',
  aliases: ['halp'],
  description: 'Display a list of the available commands.',
  exec: async ({ message }) => {
    const { commands } = await import('./index.js');
    const groupsOrder = [];
    const groups = commands.reduce((groups, command) => {
      const group = command.group || 'General';
      groups[group] = groups[group] || [];
      groups[group].push(command);

      if (!groupsOrder.includes(group)) {
        groupsOrder.push(group);
      }

      return groups;
    }, {});

    await message.reply(outdent`
      Here's a list of the available commands!

      ${groupsOrder.map((name) => formatGroup({ name, commands: groups[name] })).join('\r\n\r\n')}
    `);
  },
};

export default [
  help,
];
