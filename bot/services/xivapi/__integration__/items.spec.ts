import { expect } from 'chai';

import { xivapi } from '../index';
import { Item } from '../items';

describe('Service(XIVAPI.Items)', () => {
  const expectedItem: Item = {
    ID: 2,
    Icon: '/i/020000/020001.png',
    Name: 'Fire Shard',
    Event: false,
  };

  const expectedEventItem: Item = {
    ID: 2000024,
    Icon: '/i/021000/021002.png',
    Name: `Recruit's Toolbox`,
    Event: true,
  };

  describe('func(get)', () => {
    it('should retrieve item information', async () => {
      const items = await xivapi.items.get([expectedItem.ID]);

      expect(items).to.deep.equal([expectedItem]);
    });

    it('should retrieve event item information', async () => {
      const items = await xivapi.items.get([expectedEventItem.ID]);

      expect(items).to.deep.equal([expectedEventItem]);
    });

    it('should retrieve item and event item information', async () => {
      const items = await xivapi.items.get([
        expectedItem.ID,
        expectedEventItem.ID,
      ]);

      expect(items).to.deep.equal([expectedItem, expectedEventItem]);
    });
  });
});
