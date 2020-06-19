import { database } from '../database';

export class SongsService {
  /**
   * Returns a list of all the songs in the queue.
   *
   * @param options - the list options.
   * @returns the response from list.
   */
  async list(options: ListOptions = {}): Promise<ListResponse> {
    const { Songs } = await database();

    const songs = await Songs.findAll({
      limit: options.limit,
      order: [
        ['order', 'ASC'],
      ],
    });

    const totalSongs = await Songs.count();

    return {
      songs,
      hasMore: songs.length < totalSongs,
    };
  }

  async get(url: string): Promise<(null|Song)> {
    const { Songs } = await database();

    return Songs.findOne({
      where: {
        url,
      },
      order: [
        ['order', 'ASC'],
      ],
      raw: true,
    });
  }

  async current(): Promise<(null|Song)> {
    const { Songs } = await database();

    return Songs.findOne({
      order: [
        ['order', 'ASC'],
      ],
      raw: true,
    });
  }

  async last(): Promise<(null|Song)> {
    const { Songs } = await database();

    return Songs.findOne({
      order: [
        ['order', 'DESC'],
      ],
      raw: true,
    });
  }

  /**
   * Adds the songs to the end of the queue.
   *
   * @param channelID - the channel the request originated from.
   * @param songs - the songs to add.
   * @returns the updated song(s).
   */
  async add(channelID: string, songs: SongInternal): Promise<Song>
  async add(channelID: string, ...songs: SongInternal[]): Promise<Song[]>
  async add(channelID: string, ...songs: SongInternal[]): Promise<(Song|Song[])> {
    const { Songs } = await database();
    const last = await this.last();

    const updatedSongs: any[] = await Songs.bulkCreate(songs.map((song, index) => {
      const order = index + 1;

      return {
        ...song,
        channelID,
        order: last ? last.order + order : order,
      };
    }), {
      validate: true,
    });

    return updatedSongs.length === 1 ? updatedSongs[0].dataValues : updatedSongs.map((song) => song.dataValues);
  }

  /**
   * Adds the songs to the beginning of the queue.
   *
   * @param channelID - the channel the request originated from.
   * @param  songs - the songs to add.
   * @returns the updated song(s).
   */
  async unshift(channelID: string, songs: SongInternal): Promise<Song>
  async unshift(channelID: string, ...songs: SongInternal[]): Promise<Song[]>
  async unshift(channelID: string, ...songs: SongInternal[]): Promise<(Song|Song[])> {
    const { Songs } = await database();
    const current = await this.current();

    const updatedSongs: any[] = await Songs.bulkCreate(songs.map((song, index) => ({
      ...song,
      channelID,
      order: current ? current.order - songs.length + index : index,
    })), {
      validate: true,
    });

    return updatedSongs.length === 1 ? updatedSongs[0].dataValues : updatedSongs.map((song) => song.dataValues);
  }

  /**
   * Removes the given song from the queue.
   *
   * @param url - the url of the song to remove.
   * @returns whether a record was removed.
   */
  async remove(url: string): Promise<boolean> {
    const { Songs } = await database();

    const count = await Songs.destroy({
      where: {
        url,
      },
    })

    return count > 0;
  }

  /**
   * Clears all the songs from the queue.
   */
  async clear(): Promise<void> {
    const { Songs } = await database();

    await Songs.destroy({
      truncate: true,
    });
  }
}

export const service = new SongsService();

export interface SongInternal {
  /**
   * The song name.
   */
  title: string;

  /**
   * The url.
   */
  url: string;

  /**
   * The song duration (in ms)
   */
  duration: number;

  /**
   * The amount of time the song has been playing. (in ms)
   */
  elapsed?: number;
}

export interface Song extends SongInternal {
  /**
   * The id of the song.
   */
  id: string;

  /**
   * The channel the song request originated from.
   */
  channelID: string;

  /**
   * The order priority of the song.
   */
  order: number;
}

export interface ListOptions {
  /**
   * The max songs to return.
   */
  limit?: number;
}

export interface ListResponse {
  /**
   * The songs matching the criteria.
   */
  songs: Song[];

  /**
   * Whether there are more songs in the queue not listed here.
   */
  hasMore: boolean;
}
