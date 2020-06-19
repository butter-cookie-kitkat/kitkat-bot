import { Dump } from './dump';
import { Core } from './core';
import { Maps } from './maps';
import { CONFIG } from '../../config';

export class XIVAPI {
  public core: Core;
  public dump: Dump;
  public maps: Maps;

  constructor(key: (null|string)) {
    this.core = new Core(key);
    this.dump = new Dump(this.core);
    this.maps = new Maps(this.core);
  }
}

if (!CONFIG.XIVAPI_KEY) {
  console.warn(`An XIV API key wasn't provided, it is strongly recommended you provide one to prevent any outages!`);
}

export const xivapi = new XIVAPI(CONFIG.XIVAPI_KEY);
