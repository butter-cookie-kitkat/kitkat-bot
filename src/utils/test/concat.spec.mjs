import { expect } from './expect.mjs';

import * as Concat from '../concat.mjs';
import { chance } from './chance.mjs';

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
