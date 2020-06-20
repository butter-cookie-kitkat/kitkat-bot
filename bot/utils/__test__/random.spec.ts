import { expect } from 'chai';

import { random } from '../random';

describe('Utils(Random)', () => {
  describe('func(integer)', () => {
    const MIN = 1;
    const MAX = 3;

    const sample: number[] = Array(100).fill(null).map(() => random.integer(MIN, MAX));

    it('should be an integer', () => {
      const result = random.integer(1, 20);

      expect(result.toString()).equals(result.toFixed(0));
    });

    it('should support being the minimum', () => {
      expect(sample.some((value) => value === MIN)).equals(true);
    });

    it('should support being the maximum', () => {
      expect(sample.some((value) => value === MAX)).equals(true);
    });

    it('should always be between the min and max', () => {
      for (const result of sample) {
        expect(result).gte(MIN);
        expect(result).lte(MAX);
      }
    });
  });

  describe('func(pickone)', () => {
    it('should randomly pick an item', () => {
      const result = random.pickone(Array(1000).fill(0).map((_, i) => i));

      expect(result).exist;
      expect(result).is.a('number');
    });

    it('should support empty lists', () => {
      const result = random.pickone([]);

      expect(result).not.exist;
    });
  });
});
