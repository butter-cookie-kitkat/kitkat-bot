export function commands(commands) {
  return Object.entries(commands).reduce((output, [key, value]) => {
    output[key] = command(value);
    return output;
  }, {});
}

export function command(command) {
  return {
    aliases: [],
    args: {},
    ...command
  };
}
