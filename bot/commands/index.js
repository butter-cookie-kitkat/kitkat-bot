import * as Music from './music';
import * as Fun from './fun';
import * as RuneScape from './runescape';
import * as Debug from './debug';

export const commands = [
  Music,
  Fun,
  RuneScape,
  ...(process.env.IS_LIVE ? [] : [Debug]),
];
