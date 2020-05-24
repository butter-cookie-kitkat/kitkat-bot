import * as Normalize from '../utils/normalize';

import helpCommands from './help';
import rollCommands from './roll';
import musicCommands from './music';
import runescapeCommands from './runescape';
import trollCommands from './troll';
import debugCommands from './debug';

export const commands = Normalize.commands([
  ...helpCommands,
  ...musicCommands,
  ...runescapeCommands,
  ...rollCommands,
  ...trollCommands,
  ...debugCommands,
]);
