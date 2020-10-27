import { expect } from 'chai';

import { intl } from '../intl';
import { chance } from '../../__test__/chance';

describe('Service(Messages)', () => {
  describe('func(intl)', () => {
    it('should support pulling messages', () => {
      expect(intl('FORBIDDEN')).equals(`Senpai, we're not supposed to touch that...`);
    });
  });
});
