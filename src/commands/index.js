import * as Normalize from '../utils/normalize.js';

import helpCommands from './help.js';
import rollCommands from './roll.js';
import musicCommands from './music.js';
import debugCommands from './debug.js';

export const commands = Normalize.commands([
  ...helpCommands,
  ...musicCommands,
  ...rollCommands,
  ...debugCommands
]);
