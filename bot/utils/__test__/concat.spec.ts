import { expect } from 'chai';

import { chance } from '../chance';

import { concat } from '../concat';

describe('Utils(Concat)', () => {
  describe('func(join)', () => {
    it('should concat a list of strings', () => {
      const first = chance.string();
      const second = chance.string();

      expect(concat.join(first, second)).equals(`${first} ${second}`);
    });

    it('should exclude falsy values', () => {
      const first = chance.string();
      const second = chance.string();

      expect(concat.join(first, null, second)).equals(`${first} ${second}`);
    });
  });
});
