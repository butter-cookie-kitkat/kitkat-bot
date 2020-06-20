import { expect } from 'chai';

import { chance } from '../../__test__/chance';

import { debounce } from '../debounce';

describe('Utils(Debounce)', () => {
  describe('func(debounce)', () => {
    it('should wait before executing', () => {
      const name = chance.string();

      let resolved = false;
      const promise = new Promise((resolve) => {
        debounce.start(name, () => {
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
        debounce.start(name, reject, 5);
        debounce.clear(name);

        setTimeout(resolve, 10);
      });
    });
  });
});
