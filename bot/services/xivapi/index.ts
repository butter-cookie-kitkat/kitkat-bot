import { Extractor } from './extractor';
import { Core } from './core';
import { Maps } from './maps';
import { CONFIG } from '../../config';
import { Items } from './items';
import { Mappy } from './mappy';

export class XIVAPI {
  public core: Core;
  public items: Items;
  public extractor: Extractor;
  public maps: Maps;
  public mappy: Mappy;

  constructor(key: (null|string)) {
    this.core = new Core(key);
    this.items = new Items(this);
    this.extractor = new Extractor(this);
    this.maps = new Maps(this);
    this.mappy = new Mappy(this);
  }
}

if (!CONFIG.XIVAPI_KEY) {
  console.warn(`An XIV API key wasn't provided, it is strongly recommended you provide one to prevent any outages!`);
}

export const xivapi = new XIVAPI(CONFIG.XIVAPI_KEY);
