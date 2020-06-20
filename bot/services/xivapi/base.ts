import { XIVAPI } from '.';

export class XIVAPIBase {
  protected base: XIVAPI;

  constructor(base: XIVAPI) {
    this.base = base;
  }
}
