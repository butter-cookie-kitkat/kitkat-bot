import { chance, expect } from './test-utils';

import { debounce, clear } from '../debounce';

describe('Utils(Debounce)', () => {
  describe('func(debounce)', () => {
    it('should wait before executing', () => {
      const name = chance.string();

      let resolved = false;
      const promise = new Promise((resolve) => {
        debounce(name, () => {
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
        debounce(name, reject, 5);
        clear(name);

        setTimeout(resolve, 10);
      });
    });
  });
});
