export function commands(commands) {
  return commands.filter((command) => !command.disabled).map((value) => command(value));
}

export function command(command) {
  return {
    aliases: [],
    args: {},
    ...command,
  };
}
