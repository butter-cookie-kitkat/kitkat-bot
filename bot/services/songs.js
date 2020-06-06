/**
 * @typedef {Object} Song
 * @property {string} title - the song name.
 * @property {string} url - the url.
 * @property {number} duration - the song duration. (in ms)
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
   * @type {Song[]} the current queue.
   */
  static #songs = [];

  /**
   * Returns a list of all the songs in the queue.
   *
   * @param {ListOptions} options - the list options.
   * @returns {Promise<ListResponse>} the response from list.
   */
  static async list(options = {}) {
    let songs = options.limit ? [...Songs.#songs].slice(0, options.limit) : [...Songs.#songs];

    return {
      songs,
      hasMore: songs.length < this.#songs.length,
    };
  }

  static async get(url) {
    return Songs.#songs.find((song) => song.url === url);
  }

  static async current() {
    return Songs.#songs[0];
  }

  /**
   * Adds the songs to the end of the queue.
   *
   * @param {Song[]} songs - the songs to add.
   * @returns {(Song[]|Song)} the updated song(s).
   */
  static async add(...songs) {
    const updatedSongs = songs.map((song) => ({
      elapsed: 0,
      ...song,
    }));

    Songs.#songs = Songs.#songs.concat(updatedSongs);

    return updatedSongs.length === 1 ? updatedSongs[0] : updatedSongs;
  }

  /**
   * Adds the songs to the beginning of the queue.
   *
   * @param  {Song[]} songs - the songs to add.
   * @returns {(Song[]|Song)} the updated song(s).
   */
  static async unshift(...songs) {
    const updatedSongs = songs.map((song) => ({
      elapsed: 0,
      ...song,
    }));


    Songs.#songs = updatedSongs.concat(Songs.#songs);

    return updatedSongs.length === 1 ? updatedSongs[0] : updatedSongs;
  }

  /**
   * Removes the given song from the queue.
   *
   * @param {string} url - the url of the song to remove.
   * @returns {boolean} whether a record was removed.
   */
  static async remove(url) {
    const index = Songs.#songs.findIndex((song) => song.url === url);

    if (index === -1) return false;

    Songs.#songs.splice(index, 1);
    return true;
  }

  /**
   * Clears all the songs from the queue.
   */
  static async clear() {
    Songs.#songs = [];
  }
}
