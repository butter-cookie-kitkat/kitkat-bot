import YT from 'youtube-node';
import parse from 'url-parse';
import { CONFIG } from '../config';

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
      YouTube.#api.setKey(CONFIG.YOUTUBE_API_KEY);
    }

    return YouTube.#api;
  }

  static #duration = (duration) => {
    let [, hours = 0, minutes = 0, seconds = 0] = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);

    if (hours) minutes = Number(minutes) + (Number(hours) * 60);
    if (minutes) seconds = Number(seconds) + (minutes * 60);

    return Number(seconds) * 1000;
  }

  static #formatVideo = (video) => {
    return {
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      duration: YouTube.#duration(video.contentDetails.duration),
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
        else resolve(result.items);
      });
    });

    return {
      name: playlist.snippet.title,
      songs: await Promise.all(
        videos
          .filter(({ status }) => status.privacyStatus === 'public')
          .map((video) => YouTube.getVideoByID(video.contentDetails.videoId)),
      ),
    };
  }
}
