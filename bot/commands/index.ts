import * as Help from './help';
import * as Fun from './fun';
import * as RuneScape from './runescape';
import * as DebugLocal from './debug.local';
import * as Query from './debug';
import * as Opt from './opt-in';

import { CONFIG } from '../config';
import { CommandGroups } from './types';

export const commands: CommandGroups[] = [
  Help,
  Fun,
  RuneScape,
  Query,
  Opt,
  ...(CONFIG.IS_LIVE ? [] : [DebugLocal]),
];
