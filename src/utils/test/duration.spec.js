import { expect } from './test-utils';

import { humanize } from '../duration';

describe('Utils(Duration)', () => {
  describe('func(humanize)', () => {
    it('should support hours', () => {
      expect(humanize(3600000)).equals('1h');
    });

    it('should support minutes', () => {
      expect(humanize(60000)).equals('1m');
    });

    it('should support seconds', () => {
      expect(humanize(1000)).equals('1s');
    });

    it('should support a combination', () => {
      expect(humanize(61000)).equals('1m 1s');
    });
  });
});
