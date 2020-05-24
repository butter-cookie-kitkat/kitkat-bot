import { expect } from './test-utils';

import { Fetch } from '../fetch';

describe('Utils(Fetch)', () => {
  describe('func(Fetch)', () => {
    it('should support json responses', async () => {
      const result = await Fetch('http://www.mocky.io/v2/5ea5cbc2320000cf0fac281e');

      expect(result).deep.equals({ hello: 'world' });
    });

    it('should support non-json responses', async () => {
      const result = await Fetch('https://google.com');

      expect(result).to.be.a('string', 'Expected Fetch to support parsing non-json responses');
    });

    it('should support errors', async () => {
      const result = await Fetch('https://google.com');

      expect(result).to.be.a('string', 'Expected Fetch to support parsing non-json responses');
    });
  });
});
