import fs from 'fs';

import { Core } from './core';
import { buildUrl, Fetch } from '../../utils/fetch';
import { Arrays } from '../../utils/arrays';

const EXCLUDED_ITEM_IDS = [0];

/**
 * @typedef {Object} GatheringInfo.Location.Node
 * @property {number} node_id - the gathering point id.
 * @property {number} map_id - the map id.
 * @property {number} x - the x position of the node.
 * @property {number} y - the y position of the node.
 */

/**
 * @typedef {Object} GatheringInfo.Location
 * @property {string} id - the gathering point id.
 * @property {string} place - the place name.
 * @property {string} region - the region name.
 * @property {string} zone - the zone name.
 * @property {number} map_id - the map associated with this item.
 * @property {GatheringInfo.Location.Node[]} nodes - the gathering point node locations.
 */

/**
 * @typedef {Object} GatheringInfo
 * @property {number} id - the item id.
 * @property {string} type - the gathering type.
 * @property {boolean} hidden - whether the gathering item is hidden within the node.
 * @property {string} name - the name of the item.
 * @property {GatheringInfo.Location[]} locations - the item's gathering information.
 */

export class Dump {
  /**
   * @type {Core}
   */
  #core;

  constructor(core) {
    this.#core = core;
  }

  async items(item_ids, event) {
    const ids = item_ids.filter((id) => !EXCLUDED_ITEM_IDS.includes(id));

    return Arrays.flatten(await Promise.all(Arrays.chunk(ids, 100).map((items) =>
      this.#core.getAllPages(buildUrl(event ? '/EventItem' : '/Item', {
        columns: ['ID', 'Icon', 'Name'],
        ids: items.join(','),
      })),
    )))
      .filter(Boolean)
      .reduce((output, row) => ({
        ...output,
        [row.ID]: {
          id: row.ID,
          event: Boolean(event),
          icon: this.#core.url(row.Icon),
          name: row.Name,
        },
      }), {});
  }

  async gatheringItems() {
    const gatheringItems = await this.#core.getAllPages(buildUrl('/GatheringItem', {
      columns: ['ID', 'Item', 'IsHidden'],
    }));

    return gatheringItems.filter(({ Item }) => !EXCLUDED_ITEM_IDS.includes(Item));
  }

  async map() {
    const map = await Fetch(this.#core.url('/mappy/json'), { retry: -1 });

    return map
      .filter(({ Type }) => Type === 'Node')
      .map((node) => ({
        node_id: node.NodeID,
        map_id: node.MapID,
        x: node.PixelX,
        y: node.PixelY,
      }));
  }

  async gatheringPoints() {
    const [map, points] = await Promise.all([
      this.map(),
      this.#core.getAllPages(buildUrl('/GatheringItemPoint', {
        columns: ['GatheringPoint.ID', 'GatheringPoint.GatheringPointBase', 'GatheringPoint.PlaceName', 'GatheringPoint.TerritoryType.PlaceName', 'GatheringPoint.TerritoryType.PlaceNameRegion', 'GatheringPoint.TerritoryType.PlaceNameZone', 'GatheringPoint.TerritoryType.Map'],
      })),
    ]);

    return points.map((point) => {
      return {
        id: point.GatheringPoint.ID,
        type: point.GatheringPoint.GatheringPointBase.GatheringType.Name,
        place: point.GatheringPoint.PlaceName && point.GatheringPoint.PlaceName.Name,
        region: point.GatheringPoint.TerritoryType.PlaceName.Name,
        zone: point.GatheringPoint.TerritoryType.PlaceNameZone.Name,
        map_id: point.GatheringPoint.TerritoryType.Map.ID,
        nodes: map.filter((row) =>
          row.node_id === point.GatheringPoint.ID,
        ),
        items: Object.entries(point.GatheringPoint.GatheringPointBase).reduce((output, [key, value]) => {
          if (key.startsWith('Item')) {
            output.push(value);
          }

          return output;
        }, []),
      };
    });
  }

  /**
   * Dumps gathering information from XIV API.
   *
   * @returns {Promise<GatheringInfo[]>} the gathering information from xivapi
   */
  async gatheringInfo() {
    const [gatheringItems, points] = await Promise.all([
      this.gatheringItems(),
      this.gatheringPoints(),
    ]);

    const item_ids = gatheringItems.map(({ Item }) => Item);

    const [items, eventItems] = await Promise.all([
      this.items(item_ids),
      this.items(item_ids, true),
    ]);

    return gatheringItems.map((gatheringItem) => {
      const item = items[gatheringItem.Item] || eventItems[gatheringItem.Item];

      if (!item) {
        throw new Error(`Unable to find item with the given id. (${gatheringItem.Item})`);
      }

      const locations = points.filter((point) => point.items.includes(gatheringItem.ID));

      // TODO: Why do certain items not have points? :(
      // if (locations.length === 0) {
      //   throw new Error(`Unable to find point with the given gathering item id. (${gatheringItem.ID})`);
      // }

      return {
        id: gatheringItem.ID,
        type: locations && locations.length && locations[0].type,
        event: item.event,
        hidden: gatheringItem.IsHidden === 1,
        name: item.name,
        locations: locations.map(({ items, type, ...location }) => location),
      };
    });
  }
}
