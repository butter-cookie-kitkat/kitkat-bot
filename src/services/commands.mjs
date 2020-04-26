import { commands } from '../commands/index.mjs';

export function FindCommand(name) {
  const command = Object.values(commands).find((command) => command.name === name || command.aliases.includes(name));

  if (command) return command.command;
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
