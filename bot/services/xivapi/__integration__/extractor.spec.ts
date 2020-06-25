import { expect } from 'chai';

import { xivapi } from '../index';
import { RawGatheringNode, PristineGatheringNode, Map, GatheringItem, GatheringNode } from '../extractor';
import { arrays } from '../../../utils/arrays';
import { EXCLUDED_ITEM_IDS } from '../items';

describe.only('Service(XIVAPI.Extractor)', () => {
  describe('func(GatheringItems)', () => {
    let gatheringItems: GatheringItem[];
    before(async () => {
      gatheringItems = await xivapi.extractor.GatheringItems();
    });

    it('should retrieve the gathering items', () => {
      const [gatheringItem] = gatheringItems;

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
        'Mining',
        'Harvesting',
        'Quarrying',
        'Logging',
      ]);
    });

    describe('returns(RawGatheringNodes)', () => {
      it('should retrieve the gathering nodes', () => {
        expect(rawNodes).length(4524);
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
        const node = rawNodes.find(({ NodeID }) => NodeID === 32990) as RawGatheringNode;

        expect(node).exist;
        expect(node.Items).deep.equals([
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
        expect(nodes).length(4524);
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
        const node = nodes.find(({ NodeID }) => NodeID === 32990) as PristineGatheringNode;

        expect(node).exist;
        expect(node.Items).deep.equals([
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

      it.only('should be located on three maps', () => {
        console.log(mapsWithFireShards);

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
