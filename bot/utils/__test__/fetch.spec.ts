import { expect } from 'chai';
import sinon from 'sinon';
import * as FETCH from 'node-fetch';

import { Fetch } from '../fetch';

describe('Utils(Fetch)', () => {
  describe('func(Fetch)', () => {
    it('should support failing requests', async () => {
      const fetch = sinon.spy(FETCH, 'default');

      try {
        await Fetch('https://run.mocky.io/v3/dcd32c9d-be34-4dd2-9057-f3385d151953', {
          retry: 2,
        });

        expect.fail('Expected the request to fail.');
      } catch (error) {
        expect(error).exist;
        sinon.assert.callCount(fetch, 2);
      }
    });
  });
});
