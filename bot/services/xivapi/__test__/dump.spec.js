import { expect } from 'chai';

import { xivapi } from '../index';

describe('Service(XIVAPI.Dump)', () => {
  describe('func(items)', () => {
    it('should retrieve item information', async () => {
      const items = await xivapi.dump.items([2], false);

      expect(items).to.deep.equal({
        '2': {
          id: 2,
          icon: xivapi.core.url('/i/020000/020001.png'),
          name: 'Fire Shard',
          event: false,
        },
      });
    });

    it('should retrieve event item information', async () => {
      const items = await xivapi.dump.items([2000024], true);

      expect(items).to.deep.equal({
        '2000024': {
          id: 2000024,
          icon: xivapi.core.url('/i/021000/021002.png'),
          name: `Recruit's Toolbox`,
          event: true,
        },
      });
    });
  });

  describe('func(gatheringItems)', () => {
    it('should retrieve the gathering items', async () => {
      const [gatheringItem] = await xivapi.dump.gatheringItems();

      expect(gatheringItem).deep.equal({
        ID: 1,
        IsHidden: 0,
        Item: 2,
      });
    });
  });

  describe('func(map)', () => {
    it('should retrieve node information', async () => {
      const [node] = await xivapi.dump.map();

      expect(node).deep.equal({
        node_id: 30523,
        map_id: 22,
        x: 625,
        y: 925,
      });
    }).timeout(10000);
  });

  describe('func(gatheringPoints)', () => {
    it('should retrieve the gathering points', async () => {
      const [point] = await xivapi.dump.gatheringPoints();

      expect(point).deep.equal({
        id: 30413,
        map_id: 20,
        type: 'Mining',
        zone: 'Thanalan',
        region: 'Western Thanalan',
        place: 'Hammerlea',
        nodes: [{
          map_id: 20,
          node_id: 30413,
          x: 1318,
          y: 1213,
        }, {
          map_id: 20,
          node_id: 30413,
          x: 1325,
          y: 1200,
        }],
        items: [
          75,
          73,
          0,
          0,
          0,
          0,
          1,
          6,
        ],
      });
    }).timeout(10000);
  });

  describe('func(gatheringInfo)', () => {
    it('should retrieve the gathering info', async () => {
      const info = await xivapi.dump.gatheringInfo();

      expect(info.length).greaterThan(0);

      const log = info.find((item) => item.name === 'Elm Log');

      expect(log.id).equals(110);
      expect(log.type).equals('Logging');
      expect(log.locations).length(3);
    }).timeout(30000);
  });
});
