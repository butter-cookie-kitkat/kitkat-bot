export function FindCommand(commands, name) {
  const command = Object.values(commands).find((command) => command.name === name || command.aliases.includes(name));

  if (command) return command;
  else return null;
}
