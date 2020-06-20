import { expect } from 'chai';

import { xivapi } from '../index';
import { arrays } from '../../../utils/arrays';
import { MappyData } from '../mappy';

describe('Service(XIVAPI.Mappy)', () => {
  describe('func(get)', async () => {
    let nodes: MappyData[];

    beforeEach(async () => {
      nodes = await xivapi.mappy.get();
    });

    it('should contain "BNPC" and "Node" types', async () => {
      expect(arrays.unique(nodes.map(({ Type }) => Type))).deep.equal(['BNPC', 'Node']);
    });

    it('should contain a "BNPC" Node', () => {
      expect(nodes.find(({ Type }) => Type === 'BNPC')).deep.equal({
        Added: 1585856410,
        BNpcBaseID: 358,
        BNpcNameID: 243,
        CoordinateX: '-134.95141601562',
        CoordinateY: '83.487884521484',
        CoordinateZ: '12.804445266724',
        FateID: 0,
        HP: 2360,
        Hash: 'ca20e6a68fe74047880ec7245d827e499870b93f',
        ID: '0002cca6-60b6-4b3c-acc6-658f29052b0b',
        Level: 0,
        MapID: 23,
        MapTerritoryID: 146,
        NodeID: 0,
        PixelX: 889,
        PixelY: 1108,
        PlaceNameID: 45,
        PosX: '18.798335909843',
        PosY: '23.171388313174',
        PosZ: '0.12',
        Type: 'BNPC',
      });
    });

    it('should contain a "Node" Node', () => {
      expect(nodes.find(({ Type }) => Type === 'Node')).deep.equal({
        Added: 1585855330,
        BNpcBaseID: 0,
        BNpcNameID: 0,
        CoordinateX: '-398.76919555664',
        CoordinateY: '-98.991157531738',
        CoordinateZ: '-18.441379547119',
        FateID: 0,
        HP: 0,
        Hash: 'c64a8135fa3aae7b15d0323a21814d0a44805830',
        ID: '002403c0-2506-4e27-9870-a20a29df12fb',
        Level: 0,
        MapID: 22,
        MapTerritoryID: 145,
        NodeID: 30523,
        PixelX: 625,
        PixelY: 925,
        PlaceNameID: 44,
        PosX: '13.516827628016',
        PosY: '19.51824342832',
        PosZ: '-0.19',
        Type: 'Node',
      });
    })
  });
});
