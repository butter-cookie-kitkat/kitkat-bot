import YT from 'youtube-node';
import parse from 'url-parse';

/**
 * @typedef {Object} PlaylistResponse
 * @property {string} name - the name of the playlist
 * @property {import('./songs').Song[]} songs - the songs in the playlist
 */

export class YouTube {
  static #api;

  static get api() {
    if (!YouTube.#api) {
      YouTube.#api = new YT();
      YouTube.#api.setKey(process.env.YOUTUBE_API_KEY);
    }

    return YouTube.#api;
  }

  static #formatVideo = (video) => {
    // Playlist returns it as "contentDetails.videoId", individual returns it as "id".
    const id = video.contentDetails.videoId || video.id;

    return {
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${id}`,
    };
  }

  /**
   * Retrieves the video associated with the given url.
   *
   * @param {string} url - the youtube url.
   * @returns {Promise<import('./songs').Song>} the video information.
   */
  static async getVideo(url) {
    const { query } = parse(url, true);

    return YouTube.getVideoByID(query.v);
  }

  /**
   * Retrieves the video associated with the given id.
   *
   * @param {string} id - the youtube video id.
   * @returns {Promise<import('./songs').Song>} the video information.
   */
  static async getVideoByID(id) {
    const video = await new Promise((resolve, reject) => {
      YouTube.api.getById(id, (error, result) => {
        if (error) reject(error);
        else resolve(result.items[0]);
      });
    });

    return YouTube.#formatVideo(video);
  }

  /**
   * Retrieves the songs associated with a given playlist.
   *
   * @param {string} url - the playlist url.
   * @returns {Promise<PlaylistResponse>} the songs in the playlist.
   */
  static async getPlaylist(url) {
    // Parse URL to get ID
    const { query } = parse(url, true);

    return YouTube.getPlaylistByID(query.list);
  }

  /**
   * Retrieves the songs associated with a given playlist.
   *
   * @param {string} id - the playlist id.
   * @returns {Promise<PlaylistResponse>} the songs in the playlist.
   */
  static async getPlaylistByID(id) {
    const playlist = await new Promise((resolve, reject) => {
      YouTube.api.getPlayListsById(id, (error, result) => {
        if (error) reject(error);
        else resolve(result.items[0]);
      });
    });

    const videos = await new Promise((resolve, reject) => {
      YouTube.api.getPlayListsItemsById(id, 100, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return {
      name: playlist.snippet.title,
      songs: videos.items
        .filter(({ status }) => status.privacyStatus === 'public')
        .map((video) => YouTube.#formatVideo(video)),
    };
  }
}
