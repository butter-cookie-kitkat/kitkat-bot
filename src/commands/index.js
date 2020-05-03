import * as Normalize from '../utils/normalize.js';

import helpCommands from './help.js';
import rollCommands from './roll.js';
import musicCommands from './music.js';
import runescapeCommands from './runescape.js';
import trollCommands from './troll.js';
import debugCommands from './debug.js';

export const commands = Normalize.commands([
  ...helpCommands,
  ...musicCommands,
  ...runescapeCommands,
  ...rollCommands,
  ...trollCommands,
  ...debugCommands
]);
