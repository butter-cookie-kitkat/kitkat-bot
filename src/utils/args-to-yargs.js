const types = {
  [Array]: 'array',
  [Boolean]: 'boolean',
  [Number]: 'number',
  [String]: 'string',
};

export function argsToYargs(args) {
  return Object.entries(args).reduce((output, [name, arg]) => {
    if (!arg.positional) {
      const type = types[arg.type] || types[String];
      output[type].push(name);

      if (arg.alias) {
        output.alias[name] = arg.alias;
      }

      if (arg.default) {
        output.default[name] = arg.default;
      }
    }

    return output;
  }, {
    array: [],
    boolean: [],
    number: [],
    string: [],
    alias: {},
    default: {},
  });
}
