import sinon from 'sinon';

import { expect } from './expect.js';

import { integer, item, boolean } from '../random.js';
import { chance } from './chance.js';

describe('Utils(Random)', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('func(integer)', () => {
    it('should return an integer within the range', () => {
      const result = integer(0, 10);

      expect(result).to.be.a('number');

      expect(result >= 0).equals(true);
      expect(result <= 10).equals(true);
    });
  });

  describe('func(item)', () => {
    it('should fetch a random item from the list', () => {
      const list = new Array(chance.integer({ min: 1, max: 10 })).fill().map(() => chance.string());

      const result = item(list);

      expect(list).includes(result);
    });
  });

  describe('func(boolean)', () => {
    it('should return false if we are above the threshold', () => {
      sinon.stub(Math, 'random').returns(0.7);

      expect(boolean(60)).equals(false);
    });

    it('should return true if we are below the threshold', () => {
      sinon.stub(Math, 'random').returns(0.5);

      expect(boolean(60)).equals(true);
    });

    it('should return true if we are equal to the threshold', () => {
      sinon.stub(Math, 'random').returns(0.6);

      expect(boolean(60)).equals(true);
    });
  });
});
