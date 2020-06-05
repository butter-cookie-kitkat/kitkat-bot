import ytlist from 'youtube-playlist';
import ytdl from 'ytdl-core-discord';

/**
 * @typedef {Object} PlaylistResponse
 * @property {string} name - the name of the playlist
 * @property {import('./songs').Song[]} songs - the songs in the playlist
 */

export class YouTube {
  /**
   *
   * @param {string} url - the youtube url.
   * @returns {Promise<import('./songs').Song>} the video information.
   */
  static async getInfo(url) {
    const info = await ytdl.getBasicInfo(url);

    return {
      title: info.title,
      url: info.video_url,
      duration: Number(info.length_seconds) * 1000,
    };
  }

  /**
   * Retrieves the songs associated with a given playlist.
   *
   * @param {string} url - the playlist url.
   * @returns {Promise<PlaylistResponse>} the songs in the playlist.
   */
  static async getPlaylist(url) {
    const playlist = await ytlist(url, ['name', 'url', 'duration']);

    return {
      name: playlist.data.name,
      songs: playlist.data.playlist
        .filter(({ isPrivate }) => !isPrivate)
        .map((video) => ({
          title: video.name,
          url: video.url.replace('https://youtube.com', 'https://www.youtube.com'),
          duration: video.duration * 1000,
        })),
    };
  }
}
