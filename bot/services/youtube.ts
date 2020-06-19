import parse from 'url-parse';
import { CONFIG } from '../config';
import { Song, SongInternal } from './songs';
import { Fetch, EnhancedRequestInit } from '../utils/fetch';

export class YouTubeService {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  private fetch(url: string, options: EnhancedRequestInit = {}) {
    return Fetch(`https://www.googleapis.com/youtube/v3${url}`, {
      ...options,
      query: {
        ...options.query,
        key: this.key,
      },
      headers: {
        ...options.headers,
        Accept: 'application/json',
      },
    })
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
    const video = await this.fetch('/videos', {
      query: {
        id,
        part: ['snippet', 'contentDetails'],
      },
    });

    return video.items.length === 0 ? null : this.formatVideo(video.items[0]);
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
    const playlist = await this.fetch('/playlists', {
      query: {
        id,
        part: ['snippet'],
      },
    });

    if (playlist.items.length === 0) return null;

    const videos: any = await this.fetch('/playlistItems', {
      query: {
        playlistId: id,
        part: ['snippet', 'contentDetails', 'status'],
      },
    });

    if (videos.items < 1) return null;

    return this.formatPlaylist(playlist.items[0], videos.items);
  }

  getUrlInfo(url: string): (null|UrlInfo) {
    const { query } = parse(url, true);

    const info: UrlInfo = {};

    if (query.v) {
      info.video_id = query.v;
    }

    if (query.list) {
      info.playlist_id = query.list;
    }

    return info.video_id || info.playlist_id ? info : null;
  }

  private duration(value: string) {
    // eslint-disable-next-line prefer-const
    let [, hours = 0, minutes = 0, seconds = 0] = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i) || [];

    if (hours) minutes = +minutes + (+hours * 60);
    if (minutes) seconds = +seconds + (+minutes * 60);

    return +seconds * 1000;
  }

  private async formatPlaylist(playlist: any, videos: any[]): Promise<PlaylistResponse> {
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

  private formatVideo(video: any): SongInternal {
    return {
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      duration: this.duration(video.contentDetails.duration),
    };
  }
}

if (CONFIG.YOUTUBE_API_KEY === null) {
  throw new Error(`Cannot connect to YouTube api without an api key. Please provide one via the "YOUTUBE_API_KEY" environment variable.`);
}

export const service = new YouTubeService(CONFIG.YOUTUBE_API_KEY);

export interface UrlInfo {
  /**
   * The id of the video.
   */
  video_id?: string;

  /**
   * The id of the playlist.
   */
  playlist_id?: string;
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
