import { expect } from 'chai';

import { chance } from '../../__test__/chance';

import { service as XIVService, MapData } from '../xiv';
import { IThings } from '../../database/xivapi/things';
import { IPoints } from '../../database/xivapi/points';
import { IThingPoints } from '../../database/xivapi/thing_points';

describe('Service(XIV)', () => {
  afterEach(async () => {
    await XIVService.clear();
  });

  describe('func(createPoints)', () => {
    it('should support creating a single point', async () => {
      const expectedPoint: IPoints = {
        id: chance.word(),
        icon: chance.word(),
        map_id: chance.integer(),
        type: 'Harvesting',
        x: chance.integer(),
        y: chance.integer(),
      };

      const point = await XIVService.createPoints(expectedPoint);

      expect(point).deep.equals(expectedPoint);
    });

    it('should support creating multiple points', async () => {
      const expectedPoints: IPoints[] = Array(2).fill(null).map(() => ({
        id: chance.word(),
        icon: chance.word(),
        map_id: chance.integer(),
        type: 'Harvesting',
        x: chance.integer(),
        y: chance.integer(),
      }));

      const points = await XIVService.createPoints(...expectedPoints);

      expect(points).deep.equals(expectedPoints);
    });
  });

  describe('func(createThings)', () => {
    it('should support creating a single thing', async () => {
      const expectedThing: IThings = {
        id: chance.integer(),
        type: 'Node',
        name: chance.word(),
        hidden: false,
      };

      const thing = await XIVService.createThings(expectedThing);

      expect(thing).deep.equals(expectedThing);
    });

    it('should support creating multiple things', async () => {
      const expectedThings: IThings[] = Array(2).fill(null).map(() => ({
        id: chance.integer(),
        type: 'Node',
        name: chance.word(),
        hidden: false,
      }));

      const things = await XIVService.createThings(...expectedThings);

      expect(things).deep.equals(expectedThings);
    });
  });

  describe('func(createThingPoints)', () => {
    let expectedThing: IThings;
    let expectedPoint: IPoints;

    beforeEach(async () => {
      [expectedThing, expectedPoint] = await Promise.all([
        XIVService.createThings({
          id: chance.integer(),
          type: 'Node',
          name: chance.word(),
          hidden: false,
        }),
        XIVService.createPoints({
          id: chance.word(),
          map_id: chance.integer(),
          type: 'Harvesting',
          icon: chance.word(),
          x: chance.integer(),
          y: chance.integer(),
        }),
      ]);
    });

    it('should support creating a single thing-point', async () => {
      const expectedThingPoint: IThingPoints = {
        thing_id: expectedThing.id,
        point_id: expectedPoint.id,
      };

      const thingPoint = await XIVService.createThingPoints(expectedThingPoint);

      expect(thingPoint).deep.equals(expectedThingPoint);
    });

    it('should support creating multiple thing-points', async () => {
      const [otherExpectedThing, otherExpectedPoint] = await Promise.all([
        XIVService.createThings({
          id: chance.integer(),
          type: 'Node',
          name: chance.word(),
          hidden: false,
        }),
        XIVService.createPoints({
          id: chance.word(),
          map_id: chance.integer(),
          type: 'Harvesting',
          icon: chance.word(),
          x: chance.integer(),
          y: chance.integer(),
        }),
      ]);

      const expectedThingPoints: IThingPoints[] = [{
        thing_id: expectedThing.id,
        point_id: expectedPoint.id,
      }, {
        thing_id: otherExpectedThing.id,
        point_id: otherExpectedPoint.id,
      }];

      const thingPoints = await XIVService.createThingPoints(...expectedThingPoints);

      expect(thingPoints).deep.equals(expectedThingPoints);
    });
  });

  describe('func(find)', () => {
    let expectedThing: IThings;
    let expectedPoint: IPoints;
    let expectedThingPoint: IThingPoints;

    beforeEach(async () => {
      [expectedThing, expectedPoint] = await Promise.all([
        XIVService.createThings({
          id: chance.integer(),
          type: 'Node',
          name: chance.word(),
          hidden: false,
        }),
        XIVService.createPoints({
          id: chance.word(),
          map_id: chance.integer(),
          type: 'Harvesting',
          icon: chance.word(),
          x: chance.integer(),
          y: chance.integer(),
        }),
      ]);

      expectedThingPoint = await XIVService.createThingPoints({
        thing_id: expectedThing.id,
        point_id: expectedPoint.id,
      });
    });

    it('should find an item with the given name', async () => {
      const thing = await XIVService.find(expectedThing.name) as MapData;

      expect(thing).exist;
      expect(thing.points).deep.equals([{
        ...expectedPoint,
        ThingPoints: expectedThingPoint,
      }]);
    });

    it('should be case insensitive', async () => {
      const thing = await XIVService.find(expectedThing.name.toUpperCase()) as MapData;

      expect(thing).exist;
    });
  });
});
