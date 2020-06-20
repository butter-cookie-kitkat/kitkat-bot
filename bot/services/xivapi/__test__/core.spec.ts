import { expect } from 'chai';

import { xivapi } from '../index';
import { CONFIG } from '../../../config';

describe('Service(XIVAPI.Core)', () => {
  describe('func(url)', () => {
    it('should default to the IS_LIVE environment variable', () => {
      expect(xivapi.core.url('/GatheringItem')).equals(CONFIG.IS_LIVE ? 'https://xivapi.com/GatheringItem' : 'https://staging.xivapi.com/GatheringItem');
    });

    it('should support being live', () => {
      expect(xivapi.core.url('/GatheringItem', true)).equals('https://xivapi.com/GatheringItem');
    });

    it('should support not being live', () => {
      expect(xivapi.core.url('/GatheringItem', false)).equals('https://staging.xivapi.com/GatheringItem');
    });

    it('should ignore the live status for maps', () => {
      expect(xivapi.core.url('/m/some-map.png', false)).equals('https://xivapi.com/m/some-map.png');
    });
  });
});
