import { XIVAPIBase } from './base';

const COLUMNS = [
  'ID',
  'MapFilename',
  'PlaceNameRegion.Name',
  'PlaceName.Name',
];

export class Maps extends XIVAPIBase {
  /**
   * Formats the map into a common format.
   *
   * @param map - the map to format.
   * @returns the formatted map
   */
  private format(map: any): Map {
    return {
      id: map.ID,
      map_image: this.base.core.url(map.MapFilename),
      zone: map.PlaceNameRegion.Name,
      region: map.PlaceName.Name,
    };
  }

  /**
   * Retrives a map with the given id.
   *
   * @param id - the id of the map.
   * @returns the map info.
   */
  async get(id: number): Promise<Map> {
    return this.format(await this.base.core.fetch(`/Map/${id}`, {
      query: {
        columns: COLUMNS,
      },
    }));
  }

  /**
   * Retrives a map with the given id.
   *
   * @param ids - the ids to search for.
   * @returns the map info.
   */
  async getAll(ids: string[]): Promise<Map[]> {
    const maps = await this.base.core.fetch(`/Map`, {
      query: {
        columns: COLUMNS,
        ids,
      },
    });

    return maps.Results.map((map: any) => this.format(map));
  }
}

export interface Map {
  /**
   * the id of the map.
   */
  id: number;
  /**
   * the url of the map image.
   */
  map_image: string;
  /**
   * the map zone name.
   */
  zone: string;
  /**
   * the map region name.
   */
  region: string;
}
