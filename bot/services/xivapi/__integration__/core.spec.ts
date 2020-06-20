import { expect } from 'chai';

import { xivapi } from '../index';
import { buildUrl } from '../../../utils/fetch';

describe('Service(XIVAPI.Core)', () => {
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
