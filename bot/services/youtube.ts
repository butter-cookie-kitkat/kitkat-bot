import { YouTube as YT, YtItem, YtResult } from 'youtube-node';
import parse from 'url-parse';
import { CONFIG } from '../config';
import { Song, SongInternal } from './songs';

export class YouTubeService {
  #api?: YT;

  get api(): YT {
    if (!this.#api) {
      if (CONFIG.YOUTUBE_API_KEY === null) {
        throw new Error(`Cannot connect to YouTube api without an api key. Please provide one via the "YOUTUBE_API_KEY" environment variable.`);
      }

      this.#api = new YT();
      this.#api.setKey(CONFIG.YOUTUBE_API_KEY);
    }

    return this.#api;
  }

  /**
   * Retrieves the video associated with the given url.
   *
   * @param url - the youtube url.
   * @returns the video information.
   */
  async getVideo(url: string): Promise<(null|SongInternal)> {
    const { query } = parse(url, true);

    if (!query.v) {
      throw new Error(`Expected url to be a video url. (${url})`);
    }

    return this.getVideoByID(query.v);
  }

  /**
   * Retrieves the video associated with the given id.
   *
   * @param id - the youtube video id.
   * @returns the video information.
   */
  async getVideoByID(id: string): Promise<(null|SongInternal)> {
    const video: YtItem = await new Promise((resolve, reject) => {
      this.api.getById(id, (error, result) => {
        if (error) reject(error);
        else if (result === undefined || result.items === undefined) reject(new Error(`No video exists with the given ID. (${id})`));
        else resolve(result.items[0]);
      });
    });

    return this.formatVideo(video);
  }

  /**
   * Retrieves the songs associated with a given playlist.
   *
   * @param url - the playlist url.
   * @returns the songs in the playlist.
   */
  async getPlaylist(url: string): Promise<(null|PlaylistResponse)> {
    // Parse URL to get ID
    const { query } = parse(url, true);

    if (!query.list) {
      throw new Error(`Expected url to be a playlist url. (${url})`);
    }

    return this.getPlaylistByID(query.list);
  }

  /**
   * Retrieves the songs associated with a given playlist.
   *
   * @param id - the playlist id.
   * @returns the songs in the playlist.
   */
  async getPlaylistByID(id: string): Promise<(null|PlaylistResponse)> {
    const playlist: YtItem = await new Promise((resolve, reject) => {
      this.api.getPlaylistById(id, (error?: Error, result?: YtResult) => {
        if (error) reject(error);
        else if (result === undefined || result.items === undefined) reject(new Error(`No playlist exists with the given ID. (${id})`));
        else resolve(result.items[0]);
      });
    });

    const videos: YtItem[] = await new Promise((resolve, reject) => {
      this.api.getPlaylistItemsById(id, 100, (error?: Error, result?: YtResult) => {
        if (error) reject(error);
        else if (result === undefined || result.items === undefined) reject(new Error(`No playlist exists with the given ID. (${id})`));
        else resolve(result.items);
      });
    });

    return this.formatPlaylist(playlist, videos);
  }

  getUrlInfo(url: string): (null|UrlInfo) {
    const { query } = parse(url, true);

    if (query.v) {
      return {
        type: 'video',
        id: query.v,
      };
    } else if (query.list) {
      return {
        type: 'playlist',
        id: query.list,
      };
    }

    return null;
  }

  private duration(value: string) {
    // eslint-disable-next-line prefer-const
    let [, hours = 0, minutes = 0, seconds = 0] = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i) || [];

    if (hours) minutes = +minutes + (+hours * 60);
    if (minutes) seconds = +seconds + (+minutes * 60);

    return +seconds * 1000;
  }

  private async formatPlaylist(playlist: YtItem, videos: YtItem[]): Promise<(null|PlaylistResponse)> {
    if (!playlist.snippet || !playlist.snippet.title) {
      return null;
    }

    return {
      name: playlist.snippet.title,
      songs: await Promise.all(
        videos
          .filter(({ status, contentDetails }) => status && status.privacyStatus === 'public' && Boolean(contentDetails))
          .map((video) => this.getVideoByID((video.contentDetails as any).videoId))
          .filter(Boolean),
      ) as Song[],
    };
  }

  private formatVideo(video: YtItem): (null|SongInternal) {
    if (!video.id || !video.snippet || !video.snippet.title || !video.contentDetails || !video.contentDetails.duration) {
      return null;
    }

    return {
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      duration: this.duration(video.contentDetails.duration),
    };
  }
}

export const service = new YouTubeService();

export interface UrlInfo {
  /**
   * Whether the url is for a video or a playlist.
   */
  type: ('video'|'playlist');

  /**
   * The id of the video / playlist.
   */
  id: string;
}

export interface PlaylistResponse {
  /**
   * The name of the playlist.
   */
  name: string;

  /**
   * The songs in the playlist.
   */
  songs: Song[];
}
