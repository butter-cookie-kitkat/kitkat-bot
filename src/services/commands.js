import * as Normalize from '../utils/normalize.js';
import * as Commands from '../commands/index.js';

const commands = Normalize.commands(Commands);

export function FindCommand(name) {
  if (commands[name]) return commands[name].command;

  const command = Object.values(commands).find((command) => command.aliases.includes(name));

  if (command) return command;
  else return null;
}

export function ProcessCommand(message) {
  const match = message.content.match(/^\.(.+)/);

  if (!match) return;

  const [, rawCommand] = match;

  const [name, ...args] = rawCommand.split(' ');

  console.log(`Processing command... (${rawCommand})`);

  const command = FindCommand(name);

  if (!command) return;

  console.log(`Match found, executing! (${rawCommand})`);

  command(message, ...args);
}
