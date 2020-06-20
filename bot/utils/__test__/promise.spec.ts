import { expect } from 'chai';
import sinon from 'sinon';

import { chance } from '../../__test__/chance';
import { retry } from '../promise';

describe('Utils(Promise)', () => {
  describe('func(retry)', () => {
    it('should succeed if the callback passes within the retry count', async () => {
      const expectedResponse = chance.string();
      const cb = sinon.stub().rejects(chance.string()).onCall(2).resolves(expectedResponse);

      const response = await retry(
        cb,
        3,
        10,
      );

      expect(response).equals(expectedResponse);
      sinon.assert.callCount(cb, 3);
    });

    it('should fail if the retry count is exceeded', async () => {
      const expectedResponse = chance.string();
      const cb = sinon.stub().rejects(new Error(expectedResponse));

      try {
        await retry(
          cb,
          2,
          10,
        );

        expect.fail('Expected retry to throw an error.');
      } catch (error) {
        expect(error.message).equals(expectedResponse);
        sinon.assert.callCount(cb, 2);
      }
    });

    it('should retry indefinitely if the count is less than 0', async () => {
      const expectedResponse = chance.string();
      const cb = sinon.stub().onCall(2).resolves(expectedResponse).rejects(chance.string());

      const response = await retry(
        cb,
        -1,
        10,
      );

      expect(response).equals(expectedResponse);
      sinon.assert.callCount(cb, 3);
    });
  });
});
