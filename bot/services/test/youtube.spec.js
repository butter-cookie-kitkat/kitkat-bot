import { expect } from 'chai';

import { YouTube } from '../youtube';

describe('Service(YouTube)', () => {
  describe('func(getInfo)', () => {
    it('should retrieve information about a YouTube video', async () => {
      const song = await YouTube.getInfo('https://www.youtube.com/watch?v=2lAe1cqCOXo');

      expect(song.title).exist;
      expect(song.url).exist;
      expect(song.duration).exist;
      expect(song.elapsed).not.exist;
    });
  });
});
