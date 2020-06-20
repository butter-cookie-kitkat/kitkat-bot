import { expect } from 'chai';

import { xivapi } from '../index';
import { RawGatheringNode, PristineGatheringNode, Map, GatheringItem } from '../extractor';
import { arrays } from '../../../utils/arrays';
import { EXCLUDED_ITEM_IDS } from '../items';

describe('Service(XIVAPI.Extractor)', () => {
  describe('func(GatheringItems)', () => {
    it('should retrieve the gathering items', async () => {
      const [gatheringItem] = await xivapi.extractor.GatheringItems();

      expect(gatheringItem).deep.equal({
        ID: 1,
        IsHidden: 0,
        Item: {
          ID: 2,
          Name: 'Fire Shard',
          Icon: '/i/020000/020001.png',
          Event: false,
        },
      });
    });
  });

  describe('func(GatheringNodes)', () => {
    let rawNodes: RawGatheringNode[];
    before(async () => {
      rawNodes = await xivapi.extractor.GatheringNodes();
    });

    it('should contain the preset DotL Node Types', () => {
      expect(arrays.unique(rawNodes.map(({ NodeType }) => NodeType))).deep.equals([
        'Harvesting',
        'Quarrying',
        'Logging',
        'Mining',
      ]);
    })

    describe('returns(RawGatheringNodes)', () => {
      it('should retrieve the gathering nodes', () => {
        expect(rawNodes).length(815);
      });

      it('should contain all of the keys', () => {
        expect(rawNodes[0]).to.have.all.keys(
          'Added',
          'BNpcBaseID',
          'BNpcNameID',
          'CoordinateX',
          'CoordinateY',
          'CoordinateZ',
          'FateID',
          'HP',
          'Hash',
          'ID',
          'Level',
          'MapID',
          'MapTerritoryID',
          'NodeID',
          'NodeType',
          'PixelX',
          'PixelY',
          'PlaceNameID',
          'PosX',
          'PosY',
          'PosZ',
          'Type',
          'Items',
          'Region',
          'Zone',
          'NodeIcon',
        );
      });

      it('should return the raw item ids', () => {
        expect(rawNodes[0].Items).deep.equals([
          0,
          0,
          613,
          0,
          0,
          0,
          0,
          0,
        ]);
      });
    });

    describe('returns(GatheringNode)', () => {
      let items: GatheringItem[];
      let nodes: PristineGatheringNode[];

      before(async () => {
        items = arrays.unique(rawNodes.reduce((output, node) => {
          output.push(...node.Items.filter((id) => !EXCLUDED_ITEM_IDS.includes(id)).map((id) => ({
            ID: id,
            IsHidden: 0,
            Item: {
              ID: id + 1000,
              Name: id.toString(),
              Icon: '/i/some-icon.png',
              Event: false,
            },
          })));

          return output;
        }, [] as GatheringItem[]), ({ ID }) => ID);

        nodes = await xivapi.extractor.GatheringNodes(items);
      });

      it('should retrieve the gathering nodes', () => {
        expect(nodes).length(815);
      });

      it('should contain all of the keys', () => {
        expect(rawNodes[0]).to.have.all.keys(
          'Added',
          'BNpcBaseID',
          'BNpcNameID',
          'CoordinateX',
          'CoordinateY',
          'CoordinateZ',
          'FateID',
          'HP',
          'Hash',
          'ID',
          'Level',
          'MapID',
          'MapTerritoryID',
          'NodeID',
          'NodeType',
          'PixelX',
          'PixelY',
          'PlaceNameID',
          'PosX',
          'PosY',
          'PosZ',
          'Type',
          'Items',
          'Region',
          'Zone',
          'NodeIcon',
        );
      });

      it('should return the raw item ids', () => {
        expect(nodes[0].Items).deep.equals([
          items.find(({ ID }) => ID === 613),
        ]);
      });
    });
  });

  describe('func(GatheringMaps)', () => {
    let maps: Map[];
    before(async () => {
      maps = await xivapi.extractor.GatheringMaps();
    });

    it('should return every map', () => {
      expect(maps).length(35);
    })

    describe('Item(Fire Shard)', () => {
      let mapsWithFireShards: Map[];
      before(() => {
        mapsWithFireShards = maps.filter((map) => map.GatheringNodes.find((node) => node.Items.find((item) => item.Item.Name === 'Fire Shard')));
      });

      it('should be located on three maps', () => {
        expect(mapsWithFireShards).length(3);

        expect(mapsWithFireShards.map(({ Region }) => Region)).deep.equals([
          'Middle La Noscea',
          'Western Thanalan',
          'Eastern Thanalan',
        ]);
      });
    });
  });
});
