import { expect } from 'chai';

import { arrays } from '../arrays';

describe('Utils(Arrays)', () => {
  describe('func(chunk)', () => {
    it('should chunk the array', () => {
      expect(arrays.chunk([1, 2, 3, 4, 5], 2)).deep.equals([[1, 2], [3, 4], [5]]);
    });
  });

  describe('func(flatten)', () => {
    it('should flatten the array', () => {
      expect(arrays.flatten([[1, 2], [3, 4], 5])).deep.equals([1, 2, 3, 4, 5]);
    });
  });

  describe('func(unique)', () => {
    it('should dedupe values', () => {
      expect(arrays.unique([1, 2, 3, 2, 2])).deep.equals([1, 2, 3]);
    });

    it('should support a custom identifier', () => {
      expect(arrays.unique([{ id: 1 }, { id: 1 }], (item) => item.id)).deep.equals([{ id: 1 }]);
    });
  });
});
