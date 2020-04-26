import dedent from 'dedent';
import { concat } from '../utils/concat.mjs';

function formatExample(name, args) {
  const example = concat(
    `.${name}`,
    ...Object.keys(args).map((name) => `<${name}>`)
  );

  return `\`${example}\``;
}

function formatGroup({ name, commands }) {
  if (name === '.') {
    return commands.map((command) => formatCommand(command)).join('\r\n');
  }

  return dedent`
    **${name}**

    ${commands.map((command) => formatCommand(command)).join('\r\n')}
  `;
}

function formatCommand({ name, args, description }) {
  return `${formatExample(name, args)} - ${description}`;
}

export const help = {
  name: 'help',
  aliases: ['halp'],
  description: 'Display a list of the available commands.',
  command: async (message) => {
    const { commands } = await import('./index.mjs');
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

    await message.reply(dedent`
      Here's a list of the available commands!

      ${groupsOrder.map((name) => formatGroup({ name, commands: groups[name] })).join('\r\n\r\n')}
    `);
  }
};

export default [
  help
];
