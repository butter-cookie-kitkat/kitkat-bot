import * as Normalize from '../utils/normalize.mjs';

import helpCommands from './help.mjs';
import rollCommands from './roll.mjs';
import musicCommands from './music.mjs';
import debugCommands from './debug.mjs';

export const commands = Normalize.commands([
  ...helpCommands,
  ...musicCommands,
  ...rollCommands,
  ...debugCommands
]);
