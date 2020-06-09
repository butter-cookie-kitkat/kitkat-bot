import { expect } from 'chai';

import { chance } from '../chance';

import { Debounce } from '../debounce';

describe('Utils(Debounce)', () => {
  describe('func(debounce)', () => {
    it('should wait before executing', () => {
      const name = chance.string();

      let resolved = false;
      const promise = new Promise((resolve) => {
        Debounce.start(name, () => {
          resolved = true;
          resolve();
        }, 5);
      });

      expect(resolved).equals(false);

      return promise;
    });
  });

  describe('func(clear)', () => {
    it('should clear out a debounce callback', () => {
      const name = chance.string();

      return new Promise((resolve, reject) => {
        Debounce.start(name, reject, 5);
        Debounce.clear(name);

        setTimeout(resolve, 10);
      });
    });
  });
});
