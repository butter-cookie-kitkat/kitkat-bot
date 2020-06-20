import { expect } from 'chai';

import { math } from '../math';

describe('Utils(Math)', () => {
  describe('func(average)', () => {
    it('should average the values', () => {
      expect(math.average(1, 2, 3)).equals(2);
    });
  });

  describe('func(center)', () => {
    it('should determine the central point of the values', () => {
      const values: number[] = [0, 2, 4, 8, 16];

      expect(math.center(...values)).equals((Math.min(...values) + Math.max(...values)) / 2);
    });
  });
});
