import dedent from 'dedent';
import { concat } from '../utils/concat.js';
import * as Normalize from '../utils/normalize.js';

function formatExample(name, args) {
  const example = concat(
    `.${name}`,
    ...Object.keys(args).map((name) => `<${name}>`)
  );

  return `\`${example}\``;
}

function formatCommand(name, { args, description }) {
  return `${formatExample(name, args)} - ${description}`;
}

export const help = {
  aliases: ['halp'],
  description: 'Display a list of the available commands.',
  command: async (message) => {
    const commands = await import('./index.js');
    await message.reply(dedent`
      Here's a list of the available commands!

      ${Object.entries(Normalize.commands(commands)).map(([name, command]) => formatCommand(name, command)).join('\r\n')}
    `);
  }
};
