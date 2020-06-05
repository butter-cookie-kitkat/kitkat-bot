import { expect } from 'chai';

import { chance } from '../chance';

import { Concat } from '../concat';

describe('Utils(Concat)', () => {
  describe('func(join)', () => {
    it('should concat a list of strings', () => {
      const first = chance.string();
      const second = chance.string();

      expect(Concat.join(first, second)).equals(`${first} ${second}`);
    });

    it('should exclude falsy values', () => {
      const first = chance.string();
      const second = chance.string();

      expect(Concat.join(first, null, second)).equals(`${first} ${second}`);
    });
  });
});
