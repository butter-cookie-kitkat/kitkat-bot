import { buildUrl } from '../../utils/fetch';
import { XIVAPIBase } from './base';
import { Item } from './items';
import { MappyData } from './mappy';
import { arrays } from '../../utils/arrays';

const EXCLUDED_ITEM_IDS = [0];

export class Extractor extends XIVAPIBase {
  async GatheringItems(): Promise<GatheringItem[]> {
    const gatheringItems: any[] = await this.base.core.getAllPages(buildUrl('/GatheringItem', {
      columns: ['ID', 'Item', 'IsHidden'],
    }));

    const items = await this.base.items.get(gatheringItems.map(({ Item }) => Item));

    return gatheringItems.filter(({ Item }) => !EXCLUDED_ITEM_IDS.includes(Item)).map((gatheringItem) => {
      gatheringItem.Item = items.find(({ ID }) => gatheringItem.Item === ID);
      return gatheringItem;
    });
  }

  async GatheringNodes(): Promise<RawGatheringNode[]>
  async GatheringNodes(items: GatheringItem[]): Promise<PristineGatheringNode[]>
  async GatheringNodes(items?: GatheringItem[]): Promise<(RawGatheringNode[]|PristineGatheringNode[])> {
    const [map, points] = await Promise.all([
      this.base.mappy.get(),
      this.base.core.getAllPages(buildUrl('/GatheringPoint', {
        columns: ['ID', 'GatheringPointBase', 'TerritoryType.PlaceName.Name', 'TerritoryType.PlaceNameZone.Name'],
      })),
    ]);

    const maps = arrays.flatten(await Promise.all(arrays.chunk(arrays.unique(map.map((map) => map.MapID)), 100).map((ids) => this.base.maps.getAll(ids))));

    return map
      .map((data) => ({
        data,
        point: points.find((point) => data.NodeID === point.ID),
      }))
      .filter(({ point }) => Boolean(point) && point.GatheringPointBase.GatheringType.Name !== '●銛')
      .map(({ data, point }) => {
        const map = maps.find((map) => map.id === data.MapID);

        if (!map) {
          throw new Error(`Unable to find map for the given id. ${data.MapID}`);
        }

        return ({
          ...data,
          NodeType: point.GatheringPointBase.GatheringType.Name,
          NodeIcon: point.GatheringPointBase.GatheringType.IconMain,
          Zone: map.zone,
          Region: map.region,
          Items: Object.entries(point.GatheringPointBase).reduce((output, [key, value]: any[]) => {
            if (key.startsWith('Item')) {
              if (items) {
                if (!EXCLUDED_ITEM_IDS.includes(value)) {
                  const item = items.find((item) => item.ID === value);

                  if (!item) {
                    throw new Error(`Unable to find item with the given ID. (${value})`);
                  }

                  output.push(item);
                }
              } else {
                output.push(value);
              }
            }

            return output;
          }, [] as any[]),
        })
      });
  }

  /**
   * Extracts Gathering Information from XIV API.
   *
   * @returns the gathering information from xivapi
   */
  async GatheringMaps(): Promise<Map[]> {
    const gatheringItems = await this.GatheringItems();

    const nodes = await this.GatheringNodes(gatheringItems);

    return Object.values(nodes.reduce((output, node) => {
      output[node.MapID] = output[node.MapID] || {
        ID: node.MapID,
        Zone: node.Zone,
        Region: node.Region,
        GatheringNodes: [],
      };

      output[node.MapID].GatheringNodes.push(node);

      return output;
    }, {} as { [key: string]: Map }));
  }
}

export interface ItemWithGatheringID extends Item {
  GatheringItemID: number;
}

export interface GatheringItem {
  /**
   * The Gathering Item ID.
   */
  ID: number;

  /**
   * Whether the item is hidden on the node.
   */
  IsHidden: number;

  /**
   * The item associated to this Gathering Item.
   */
  Item: Item;
}

export interface Map {
  /**
   * The map id.
   */
  ID: number;

  /**
   * The Zone Name. (e.g. Black Shroud)
   */
  Zone: string;

  /**
   * The Region Name. (e.g. North Shroud)
   */
  Region: string;

  GatheringNodes: PristineGatheringNode[];
}

export interface GatheringNode extends MappyData {
  /**
   * The Gathering Node Type.
   */
  NodeType: ('Harvesting'|'Quarrying'|'Logging'|'Mining');

  /**
   * The url to the node icon.
   */
  NodeIcon: string;

  /**
   * The Zone Name. (e.g. Black Shroud)
   */
  Zone: string;

  /**
   * The Region Name. (e.g. North Shroud)
   */
  Region: string;
}

export interface RawGatheringNode extends GatheringNode {
  /**
   * The Gathering Item IDs of the items attached to this node.
   */
  Items: number[];
}

export interface PristineGatheringNode extends GatheringNode {
  /**
   * The Items attached to this node.
   */
  Items: GatheringItem[];
}
