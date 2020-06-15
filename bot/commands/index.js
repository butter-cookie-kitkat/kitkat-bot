import * as Music from './music';
import * as Fun from './fun';
import * as RuneScape from './runescape';
import * as DebugLocal from './debug.local';
import * as Query from './debug';
import * as FFXIV from './ffxiv';

import { CONFIG } from '../config';

export const commands = [
  Music,
  Fun,
  FFXIV,
  RuneScape,
  Query,
  ...(CONFIG.IS_LIVE ? [] : [DebugLocal]),
];
