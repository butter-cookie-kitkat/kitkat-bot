import { database } from '../database';

/**
 * @typedef {Object} Song
 * @property {string} title - the song name.
 * @property {string} url - the url.
 * @property {number} duration - the song duration. (in ms)
 * @property {string} channelID - the channel the song request originated from.
 * @property {number} [elapsed=0] - the amount of time the song has been playing. (in ms)
 */

/**
 * @typedef {Object} ListOptions
 * @property {number} limit - the max songs to return.
 */

/**
 * @typedef {Object} ListResponse
 * @property {number} songs - the songs matching the criteria.
 * @property {boolean} hasMore - whether there are more songs in the queue not listed here.
 */

export class Songs {
  /**
   * Returns a list of all the songs in the queue.
   *
   * @param {ListOptions} options - the list options.
   * @returns {Promise<ListResponse>} the response from list.
   */
  static async list(options = {}) {
    const { song } = await database();

    const songs = await song.findAll({
      limit: options.limit,
      order: [
        ['order', 'ASC'],
      ],
    });

    const totalSongs = await song.count();

    return {
      songs,
      hasMore: songs.length < totalSongs,
    };
  }

  static async get(url) {
    const { song } = await database();

    return song.findOne({
      where: {
        url,
      },
      order: [
        ['order', 'ASC'],
      ],
    });
  }

  static async current() {
    const { song } = await database();

    return song.findOne({
      order: [
        ['order', 'ASC'],
      ],
    });
  }

  static async last() {
    const { song } = await database();

    return song.findOne({
      order: [
        ['order', 'DESC'],
      ],
    });
  }

  static #format = (channelID, ...songs) => {
    return songs.map((song) => ({
      channelID,
      ...song,
    }));
  }

  /**
   * Adds the songs to the end of the queue.
   *
   * @param {string} channelID - the channel the request originated from.
   * @param {Song[]} songs - the songs to add.
   * @returns {(Song[]|Song)} the updated song(s).
   */
  static async add(channelID, ...songs) {
    const { song } = await database();
    const last = await Songs.last();

    const updatedSongs = Songs.#format(channelID, ...songs).map((song, index) => {
      song.order = last ? last.order + index : index;
      return song;
    });

    await song.bulkCreate(updatedSongs, {
      validate: true,
    });

    return updatedSongs.length === 1 ? updatedSongs[0] : updatedSongs;
  }

  /**
   * Adds the songs to the beginning of the queue.
   *
   * @param {string} channelID - the channel the request originated from.
   * @param  {Song[]} songs - the songs to add.
   * @returns {(Song[]|Song)} the updated song(s).
   */
  static async unshift(channelID, ...songs) {
    const { song } = await database();
    const current = await Songs.current();

    const updatedSongs = this.#format(channelID, ...songs).map((song, index) => {
      song.order = current ? current.order - songs.length + index : index;
      return song;
    });

    await song.bulkCreate(updatedSongs, {
      validate: true,
    });

    return updatedSongs.length === 1 ? updatedSongs[0] : updatedSongs;
  }

  /**
   * Removes the given song from the queue.
   *
   * @param {string} url - the url of the song to remove.
   * @returns {boolean} whether a record was removed.
   */
  static async remove(url) {
    const { song } = await database();

    const count = await song.destroy({
      where: {
        url,
      },
    })

    return count > 0;
  }

  /**
   * Clears all the songs from the queue.
   */
  static async clear() {
    const { song } = await database();

    await song.destroy({
      truncate: true,
    });
  }
}
