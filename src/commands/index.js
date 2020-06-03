import * as Normalize from '../utils/normalize';

import helpCommands from './help';
import rollCommands from './roll';
import musicCommands from './music';
import runescapeCommands from './runescape';
import trollCommands from './troll';
import debugCommands from './debug';

const DEFAULT_GROUP = 'General';

export const commands = Normalize.commands([
  ...helpCommands,
  ...musicCommands,
  ...runescapeCommands,
  ...rollCommands,
  ...trollCommands,
  ...debugCommands,
]);

export const order = commands.reduce((list, command) => {
  const group = command.group || DEFAULT_GROUP;

  if (!list.includes(group)) {
    list.push(group);
  }

  return list;
}, []);

export const groups = commands.reduce((groups, command) => {
  const group = command.group || DEFAULT_GROUP;

  groups[group] = groups[group] || [];
  groups[group].push(command);

  return groups;
}, {});
