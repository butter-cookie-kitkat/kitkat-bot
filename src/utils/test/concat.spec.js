import { chance, expect } from './test-utils.js';

import * as Concat from '../concat.js';

describe('Utils(Concat)', () => {
  describe('func(concat)', () => {
    it('should join strings together', () => {
      const first = chance.string();
      const second = chance.string();

      expect(Concat.concat(first, second)).equals(`${first} ${second}`);
    });

    it('should ignore falsy strings', () => {
      const first = chance.string();
      const second = chance.string();

      expect(Concat.concat(first, null, second)).equals(`${first} ${second}`);
    });
  });
});
