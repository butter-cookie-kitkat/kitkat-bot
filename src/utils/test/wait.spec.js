import { wait } from '../wait';
import { expect } from './test-utils';

describe('Utils(Wait)', () => {
  describe('func(wait)', () => {
    it('should wait a given number of milliseconds', async () => {
      let resolved = false;
      const promise = wait(10).finally(() => {
        resolved = true;
      });

      expect(resolved).equals(false);

      await new Promise((resolve) => setTimeout(resolve, 5));

      expect(resolved).equals(false);

      return promise;
    });
  });
});
