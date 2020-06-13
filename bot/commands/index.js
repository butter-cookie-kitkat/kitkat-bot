import * as Music from './music';
import * as Fun from './fun';
import * as RuneScape from './runescape';
import * as Debug from './debug';
import * as Query from './query';
import * as FFXIV from './ffxiv';

import { CONFIG } from '../config';

export const commands = [
  Music,
  Fun,
  FFXIV,
  RuneScape,
  Query,
  ...(CONFIG.IS_LIVE ? [] : [Debug]),
];
