import { expect } from 'chai';

import { version } from '../version';

describe('Utils(Version)', () => {
  describe('func(sha)', () => {
    it('should support providing a full sha', () => {
      const sha = '123456789';

      expect(version.sha(sha)).equals(sha.substr(0, 7));
    });

    it('should support providing nothing', () => {
      expect(version.sha()).equals('Unknown');
    });
  });
});
