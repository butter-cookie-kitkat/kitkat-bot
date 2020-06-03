export function commands(commands) {
  return commands.filter((command) => !command.disabled).map((value) => command(value));
}

export function command(command) {
  return {
    aliases: [],
    ...command,
    args: args(command.args),
  };
}

export function args(args = {}) {
  return Object.entries(args).reduce((output, [name, value]) => {
    output[name] = arg(value);
    return output;
  }, {});
}

export function arg(value) {
  if (typeof(value) !== 'object') {
    return {
      type: String,
      description: value,
      positional: true,
    };
  }

  return value;
}
