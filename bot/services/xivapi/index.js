import fs from 'fs';
import { Dump } from './dump';
import { Core } from './core';
import { CONFIG } from '../../config';

export class XIVAPI {
  constructor(key) {
    this.core = new Core(key);
    this.dump = new Dump(this.core);
  }
}

export const xivapi = new XIVAPI(CONFIG.XIVAPI_KEY);
