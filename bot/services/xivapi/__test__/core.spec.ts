import { expect } from 'chai';

import { xivapi } from '../index';
import { CONFIG } from '../../../config';
import { buildUrl } from '../../../utils/fetch';

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

  describe('func(getPage)', () => {
    it('should retrieve page 1 by default', async () => {
      const items = await xivapi.core.getPage('/GatheringItem');

      expect(items.Pagination.Results).equals(100);
      expect(items.Results).length(items.Pagination.Results);
    });

    it('should retrieve whatever page is specified', async () => {
      const expectedPage = 3;
      const items = await xivapi.core.getPage('/GatheringItem', expectedPage);

      expect(items.Pagination.Page).equals(expectedPage);
      expect(items.Pagination.Results).equals(100);
      expect(items.Results).length(items.Pagination.Results);
    });

    it('should support invalid ids', async () => {
      const items = await xivapi.core.getPage(buildUrl('/GatheringItem', {
        ids: ['abc'],
      }));

      expect(items.Results).deep.equals([{
        ID: 0,
        Icon: null,
        Name: null,
        Url: '/GatheringItem/0',
      }]);
    });
  });

  describe('func(getAllPages)', () => {
    it('should retrieve all pages for a given endpoint', async () => {
      const { Pagination } = await xivapi.core.getPage('/GatheringItem');

      const items = await xivapi.core.getAllPages('/GatheringItem');

      expect(items).length(Pagination.ResultsTotal);
    });

    it('should support invalid ids', async () => {
      const items = await xivapi.core.getAllPages(buildUrl('/GatheringItem', {
        ids: ['abc'],
      }));

      expect(items).deep.equals([{
        ID: 0,
        Icon: null,
        Name: null,
        Url: '/GatheringItem/0',
      }]);
    });
  });
});
