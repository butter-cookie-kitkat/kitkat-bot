import { buildUrl } from '../../utils/fetch';
import { arrays } from '../../utils/arrays';
import { XIVAPIBase } from './base';

export const EXCLUDED_ITEM_IDS = [0];

export class Items extends XIVAPIBase {
  /**
   * Returns true if the given id is an event id.
   *
   * @param id - the id to verify.
   * @returns whether the given id is an event id.
   */
  isEventID(id: number): boolean {
    return Boolean(id.toString().match(/^200\d{3}\d*/));
  }

  async get(item_ids: number[]): Promise<Item[]> {
    const ids = item_ids.reduce((ids, id) => {
      if (!EXCLUDED_ITEM_IDS.includes(id)) {
        if (this.isEventID(id)) {
          ids.event_items.push(id);
        } else {
          ids.items.push(id);
        }
      }

      return ids;
    }, { event_items: [], items: [] } as { event_items: number[], items: number[] });

    const items: Item[] = arrays.flatten(await Promise.all(arrays.chunk(ids.items, 100).map((items) =>
      this.base.core.getPage(buildUrl('/Item', {
        columns: ['ID', 'Icon', 'Name'],
        ids: items,
      })).then(({ Results }) => Results.map((item) => {
        if (!item) console.log('items', items);

        item.Event = false;
        return item;
      })),
    )));

    const event_items: Item[] = arrays.flatten(await Promise.all(arrays.chunk(ids.event_items, 100).map((items) =>
      this.base.core.getPage(buildUrl('/EventItem', {
        columns: ['ID', 'Icon', 'Name'],
        ids: items,
      })).then(({ Results }) => Results.map((item) => {
        if (!item) console.log('event items', items);

        item.Event = true;
        return item;
      })),
    )));

    items.push(...event_items)

    return items;
  }
}

export interface Item {
  /**
   * The ID of this item.
   */
  ID: number;

  /**
   * The name of the item.
   */
  Name: string;

  /**
   * The url to the items icon.
   */
  Icon: string;

  /**
   * Whether this is an event item.
   */
  Event: boolean;
}
