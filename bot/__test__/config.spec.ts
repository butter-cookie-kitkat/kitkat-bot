import { expect } from 'chai';
import sinon from 'sinon';

import { defaults, env } from '../config';
import { chance } from './chance';

describe('Utils(Config)', () => {
  describe('func(defaults)', () => {
    it('should return the first defined value (strings)', () => {
      expect(defaults('', 'hello')).equals('');
    });

    it('should return the first defined value (integers)', () => {
      expect(defaults(0, 1)).equals(0);
    });

    it('should return the first defined value (booleans)', () => {
      expect(defaults(false, true)).equals(false);
    });
  });

  describe('func(env)', () => {
    beforeEach(() => {
      sinon.stub(process, 'env').get(() => ({
        IS_LIVE: 'true',
      }));
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should support retrieving environment variables', () => {
      expect(env('IS_LIVE')).equals('true');
    });

    it('should throw an error if the variable does not exist', () => {
      const name = chance.string();

      expect(() => env(name)).to.throw(Error, `Expected the "${name}" environment variable to be defined.`);
    });

    it('should support retrieving environment variables with a default', () => {
      expect(env(chance.string(), 'default')).equals('default');
    });
  });
});
