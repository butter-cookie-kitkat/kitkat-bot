import { expect } from 'chai';

import { chance } from '../../__test__/chance';

import { service as SongsService } from '../songs';

describe('Service(Songs)', () => {
  afterEach(async () => {
    await SongsService.clear();
  });

  describe('func(add)', () => {
    it('should add the song to the queue', async () => {
      const expectedChannelID = chance.string();
      const expectedSong = {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      }

      const song = await SongsService.add(expectedChannelID, expectedSong);

      expect(song).deep.equals({
        ...expectedSong,
        id: song.id,
        channelID: expectedChannelID,
        order: 1,
      });
    });

    it('should support batching songs together', async () => {
      const expectedChannelID = chance.string();
      const expectedSong = {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      }

      const songs = await SongsService.add(expectedChannelID, expectedSong, expectedSong);

      expect(songs).deep.equals(songs.map((song, index) => ({
        ...expectedSong,
        id: song.id,
        channelID: expectedChannelID,
        order: 1 + index,
      })));
    });
  });

  describe('func(unshift)', () => {
    beforeEach(async () => {
      await SongsService.add(chance.string(), {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      });
    });

    it('should add the song to the beginning of the queue', async () => {
      const expectedChannelID = chance.string();
      const expectedSong = {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      }

      const song = await SongsService.unshift(expectedChannelID, expectedSong);

      expect(song).deep.equals({
        ...expectedSong,
        id: song.id,
        channelID: expectedChannelID,
        order: 0,
      });
    });

    it('should support batching songs together', async () => {
      const expectedChannelID = chance.string();
      const expectedSong = {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      }

      const songs = await SongsService.unshift(expectedChannelID, expectedSong, expectedSong);

      expect(songs).deep.equals(songs.map((song, index) => ({
        ...expectedSong,
        id: song.id,
        channelID: expectedChannelID,
        order: -1 + index,
      })));
    });
  });

  describe('func(list)', () => {
    beforeEach(async () => {
      await SongsService.add(chance.string(), {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      });
      await SongsService.add(chance.string(), {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      });
    });

    it('should return a list of songs', async () => {
      const response = await SongsService.list();

      expect(response.count).equals(2);
      expect(response.songs).length(2);
      expect(response.hasMore).equals(false);
    });

    it('should support limiting the number of results', async () => {
      const response = await SongsService.list({
        limit: 1,
      });

      expect(response.count).equals(2);
      expect(response.songs).length(1);
      expect(response.hasMore).equals(true);
    });
  });

  describe('func(get)', () => {
    it('should support retrieving songs by their url', async () => {
      const expectedSong = await SongsService.add(chance.string(), {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      });

      const song = await SongsService.get(expectedSong.url);

      expect(song).deep.equals(expectedSong);
    });
  });

  describe('func(current)', () => {
    it('should return the current song', async () => {
      const expectedSong = await SongsService.add(chance.string(), {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      });

      await SongsService.add(chance.string(), {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      });

      const song = await SongsService.current();

      expect(song).deep.equals(expectedSong);
    });
  });

  describe('func(last)', () => {
    it('should return the last song', async () => {
      await SongsService.add(chance.string(), {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      });

      const expectedSong = await SongsService.add(chance.string(), {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      });

      const song = await SongsService.last();

      expect(song).deep.equals(expectedSong);
    });
  });

  describe('func(remove)', () => {
    it('should support removing a song by its url', async () => {
      const expectedSong = await SongsService.add(chance.string(), {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      });

      expect(await SongsService.remove(expectedSong.url)).equals(true);

      expect(await SongsService.list()).deep.equals({
        count: 0,
        songs: [],
        hasMore: false,
      });
    });
  });

  describe('func(clear)', () => {
    it('should remove all of the songs', async () => {
      await SongsService.add(chance.string(), {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      });
      await SongsService.add(chance.string(), {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      });
      await SongsService.add(chance.string(), {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      });

      await SongsService.clear();

      expect(await SongsService.list()).deep.equals({
        count: 0,
        songs: [],
        hasMore: false,
      });
    });
  });
});
