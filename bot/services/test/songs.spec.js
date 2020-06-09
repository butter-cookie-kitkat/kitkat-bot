import { expect } from 'chai';

import { chance } from '../../utils/chance';

import { Songs } from '../songs';

describe('Service(Songs)', () => {
  afterEach(async () => {
    await Songs.clear();
  });

  describe('func(add)', () => {
    it('should add the song to the queue', async () => {
      const expectedChannelID = chance.string();
      const expectedSong = {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      }

      const song = await Songs.add(expectedChannelID, expectedSong);

      expect(song).deep.equals({
        ...expectedSong,
        channelID: expectedChannelID,
      });
    });

    it('should support batching songs together', async () => {
      const expectedChannelID = chance.string();
      const expectedSong = {
        title: chance.string(),
        url: chance.url(),
        duration: chance.integer(),
      }

      const songs = await Songs.add(expectedChannelID, expectedSong, expectedSong);

      expect(songs).deep.equals([{
        ...expectedSong,
        channelID: expectedChannelID,
      }, {
        ...expectedSong,
        channelID: expectedChannelID,
      }]);
    });
  });

  describe('func(list)', () => {
    beforeEach(async () => {
      await Songs.add(chance.string(), {});
      await Songs.add(chance.string(), {});
    });

    it('should return a list of songs', async () => {
      const response = await Songs.list();

      expect(response.songs).length(2);
      expect(response.hasMore).equals(false);
    });

    it('should support limiting the number of results', async () => {
      const response = await Songs.list({
        limit: 1,
      });

      expect(response.songs).length(1);
      expect(response.hasMore).equals(true);
    });
  });

  describe('func(get)', () => {
    it('should support retrieving songs by their url', async () => {
      const expectedSong = await Songs.add(chance.string(), {
        url: chance.url(),
      });

      expect(await Songs.get(expectedSong.url)).equals(expectedSong);
    });
  });

  describe('func(current)', () => {
    it('should return the current song', async () => {
      const expectedSong = await Songs.add(chance.string(), {
        url: chance.url(),
      });

      await Songs.add(chance.string(), {
        url: chance.url(),
      });

      expect(await Songs.current()).equals(expectedSong);
    });
  });

  describe('func(remove)', () => {
    it('should support removing a song by its url', async () => {
      const expectedSong = await Songs.add(chance.string(), {
        url: chance.url(),
      });

      expect(await Songs.remove(expectedSong.url)).equals(true);

      expect(await Songs.list()).deep.equals({
        songs: [],
        hasMore: false,
      });
    });
  });

  describe('func(clear)', () => {
    it('should remove all of the songs', async () => {
      await Songs.add(chance.string(), {});
      await Songs.add(chance.string(), {});
      await Songs.add(chance.string(), {});

      await Songs.clear();

      expect(await Songs.list()).deep.equals({
        songs: [],
        hasMore: false,
      });
    });
  });
});
