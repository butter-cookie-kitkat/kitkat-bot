import fs from 'fs';

import { Core } from './core';

/**
 * @typedef {Object} Map
 * @property {number} id - the id of the map.
 * @property {number} map_image - the url of the map image.
 * @property {string} zone - the map zone name.
 * @property {string} region - the map region name.
 */

const COLUMNS = [
  'ID',
  'MapFilename',
  'PlaceNameRegion.Name',
  'PlaceName.Name',
];

export class Maps {
  /**
   * @type {Core}
   */
  #core;

  constructor(core) {
    this.#core = core;
  }

  /**
   * Formats the map into a common format.
   *
   * @param {*} map
   * @returns {Map} - the formatted map
   */
  #map = (map) => ({
    id: map.ID,
    map_image: this.#core.url(map.MapFilename),
    zone: map.PlaceNameRegion.Name,
    region: map.PlaceName.Name,
  })

  /**
   * Retrives a map with the given id.
   *
   * @param {integer} id - the id of the map.
   * @returns {Promise<Map>} the map info.
   */
  async get(id) {
    return this.#map(await this.#core.fetch(`/Map/${id}`, {
      query: {
        columns: COLUMNS,
      },
    }));
  }

  /**
   * Retrives a map with the given id.
   *
   * @param {integer[]} ids - the ids to search for.
   * @returns {Promise<Map[]>} the map info.
   */
  async getAll(ids) {
    const maps = await this.#core.fetch(`/Map`, {
      query: {
        columns: COLUMNS,
        ids,
      },
    });

    return maps.Results.map(this.#map);
  }
}
