import * as Help from './help';
import * as Music from './music';
import * as Fun from './fun';
import * as RuneScape from './runescape';
import * as DebugLocal from './debug.local';
import * as Query from './debug';
import * as XIV from './xiv';

import { CONFIG } from '../config';
import { CommandGroups } from './types';

export const commands: CommandGroups[] = [
  Help,
  Music,
  Fun,
  XIV,
  RuneScape,
  Query,
  ...(CONFIG.IS_LIVE ? [] : [DebugLocal]),
];
