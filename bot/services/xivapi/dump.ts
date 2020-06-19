import { Core } from './core';
import { buildUrl, Fetch } from '../../utils/fetch';
import { arrays } from '../../utils/arrays';

const EXCLUDED_ITEM_IDS = [0];

export class Dump {
  private core: Core;

  constructor(core: Core) {
    this.core = core;
  }

  async items(item_ids: number[], event = false): Promise<Items> {
    const ids = item_ids.filter((id) => !EXCLUDED_ITEM_IDS.includes(id));

    return arrays.flatten(await Promise.all(arrays.chunk(ids, 100).map((items) =>
      this.core.getAllPages(buildUrl(event ? '/EventItem' : '/Item', {
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
          icon: this.core.url(row.Icon),
          name: row.Name,
        },
      }), {});
  }

  async gatheringItems(): Promise<any[]> {
    const gatheringItems: any[] = await this.core.getAllPages(buildUrl('/GatheringItem', {
      columns: ['ID', 'Item', 'IsHidden'],
    }));

    return gatheringItems.filter(({ Item }) => !EXCLUDED_ITEM_IDS.includes(Item));
  }

  async map(): Promise<Node[]> {
    const map: any[] = await Fetch(this.core.url('/mappy/json'), { retry: -1 });

    return map
      .filter(({ Type }) => Type === 'Node')
      .map((node) => ({
        node_id: node.NodeID,
        map_id: node.MapID,
        x: node.PixelX,
        y: node.PixelY,
      }));
  }

  async gatheringPoints(): Promise<any[]> {
    const [map, points] = await Promise.all([
      this.map(),
      this.core.getAllPages(buildUrl('/GatheringItemPoint', {
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
        items: Object.entries(point.GatheringPoint.GatheringPointBase).reduce((output, [key, value]: any[]) => {
          if (key.startsWith('Item')) {
            output.push(value);
          }

          return output;
        }, [] as any[]),
      };
    });
  }

  /**
   * Dumps gathering information from XIV API.
   *
   * @returns the gathering information from xivapi
   */
  async gatheringInfo(): Promise<GatheringInfo[]> {
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

export type Items = {
  [key: string]: Item;
};

export interface Item {
  /**
   * The ID of this item.
   */
  id: string;

  /**
   * The name of the item.
   */
  name: string;

  /**
   * Whether this is an event item.
   */
  event: boolean;

  /**
   * The url to the items icon.
   */
  icon: string;
}

export interface Node {
  /**
   * the gathering point id.
   */
  node_id: number;

  /**
   * the map id.
   */
  map_id: number;

  /**
   * The x position of the node.
   */
  x: number;

  /**
   * The y position of the node.
   */
  y: number;
}

export interface Location {
  /**
   * The gathering point id.
   */
  id: string;

  /**
   * The place name.
   */
  place: string;

  /**
   * The region name.
   */
  region: string;

  /**
   * The zone name.
   */
  zone: string;

  /**
   * The id of the map associated with this item.
   */
  map_id: number;

  /**
   * The gathering nodes at this location.
   */
  nodes: Node[];
}

export interface GatheringInfo {
  /**
   * The item id.
   */
  id: number;

  /**
   * The name of the item.
   */
  name: string;

  /**
   * The gathering type.
   */
  type: string;

  /**
   * Whether the gathering item is hidden within the node.
   */
  hidden: boolean;

  /**
   * The items gathering locations.
   */
  locations: Location[];
}
