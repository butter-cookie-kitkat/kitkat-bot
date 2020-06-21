import { expect } from 'chai';

import { intl } from '../intl';
import { chance } from '../../__test__/chance';

describe('Service(Messages)', () => {
  describe('func(intl)', () => {
    it('should support pulling messages', () => {
      expect(intl('FORBIDDEN')).equals(`Senpai, we're not supposed to touch that...`);
    });

    it('should support providing arguments', () => {
      const reason = chance.string();

      expect(intl('AUTO_LEAVE', { reason })).equals(`Automatically leaving voice channel. (Reason: ${reason})`);
    });
  });
});
