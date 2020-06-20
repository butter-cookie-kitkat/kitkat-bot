import { XIVAPIBase } from './base';
import { Fetch } from '../../utils/fetch';

export class Mappy extends XIVAPIBase {
  async get(): Promise<MappyData[]> {
    return Fetch(this.base.core.url('/mappy/json'), { retry: -1 });
  }
}


export interface MappyData {
  /**
   * The unique guid of this node.
   */
  ID: string;

  /**
   * The hash id of this node... ?
   */
  Hash: string;

  /**
   * The date this node was added.
   */
  Added: number;

  /**
   * The type of this node.
   */
  Type: ('BNPC'|'Node');

  /**
   * The X Coordinate. (within the territory.. ?)
   */
  CoordinateX: string;

  /**
   * The Y Coordinate. (within the territory.. ?)
   */
  CoordinateY: string;

  /**
   * The Z Coordinate. (within the territory.. ?)
   */
  CoordinateZ: string;

  /**
   * The ID of the Fate for this NPC.
   */
  FateID: number;

  /**
   * The map id this node is located on.
   */
  MapID: number;

  /**
   * The map territory id this node is located on.
   */
  MapTerritoryID: number;

  /**
   * The id of this node.
   */
  NodeID: number;

  /**
   * The X position in pixels of this node (relative to overall map width).
   */
  PixelX: number;

  /**
   * The Y position in pixels of this node (relative to overall map height).
   */
  PixelY: number;

  /**
   * The Place ID of this node.
   */
  PlaceNameID: number;

  /**
   * The X position of this node (within the map).
   */
  PosX: string;

  /**
   * The Y position of this node (within the map).
   */
  PosY: string;

  /**
   * The Z position of this node (within the map).
   */
  PosZ: string;

  /**
   * The amount of HP this NPC has.
   */
  HP: number;

  /**
   * The Base NPC ID
   */
  BNpcBaseID: number;

  /**
   * The NPC Name ID
   */
  BNpcNameID: number;

  /**
   * The level of this npc.
   */
  Level: number;
}
