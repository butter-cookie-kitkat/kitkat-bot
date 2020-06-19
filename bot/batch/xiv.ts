import * as Loggers from '../utils/loggers';
import { database } from '../database';
import { arrays } from '../utils/arrays';
import { xivapi } from '../services/xivapi';
import { BatchJob } from './types';
import { IPoints } from '../database/xivapi/points';
import { IThingPoints } from '../database/xivapi/thing_points';
import { IThings } from '../database/xivapi/things';

export interface FlattenedOutput {
  things: IThings[];
  points: IPoints[];
  thing_points: IThingPoints[];
}

export const gathering: BatchJob = async () => {
  const { XIV_API } = await database();

  const info = await xivapi.dump.gatheringInfo();

  Loggers.workers('Destroying Thing-Points Associations...');

  await XIV_API.ThingPoints.destroy({
    truncate: true,
    cascade: true,
  });

  await XIV_API.Points.destroy({
    truncate: true,
    cascade: true,
  });

  await XIV_API.Things.destroy({
    truncate: true,
    cascade: true,
  });

  const flattened = info.reduce((output, row) => {
    const points: IPoints[] = row.locations.length ? row.locations.reduce((output, location) => {
      return output.concat(location.nodes.map((node) => ({
        id: `${node.node_id}-${node.x}-${node.y}`,
        map_id: node.map_id,
        x: node.x,
        y: node.y,
      })));
    }, [] as IPoints[]) : [];

    const thing: IThings = {
      id: `Item-${row.id}`,
      type: 'Item',
      name: row.name,
      hidden: row.hidden,
    };

    const thing_points: IThingPoints[] = points.map((point) => ({
      thing_id: thing.id,
      point_id: point.id,
    }));

    output.points = output.points.concat(points);
    output.thing_points = output.thing_points.concat(thing_points);
    output.things.push(thing);

    return output;
  }, { things: [], points: [], thing_points: [] } as FlattenedOutput);

  flattened.points = arrays.unique(flattened.points, (item) => item.id);
  flattened.thing_points = arrays.unique(flattened.thing_points, (item) => `${item.thing_id}.${item.point_id}`);

  const CHUNK_SIZE = 100;
  await arrays.chunk(flattened.things, CHUNK_SIZE).reduce(async (promise, rows, i) => {
    await promise;

    const range = `${i * CHUNK_SIZE}-${i * CHUNK_SIZE + rows.length}`;
    Loggers.workers(`Saving Things... (${range})`);

    try {
      await XIV_API.Things.bulkCreate(rows);
    } catch (error) {
      console.log(rows.map((row) => row.id));
      throw error;
    }

    Loggers.workers(`Successfully saved Things! (${range})`);
  }, Promise.resolve());

  await arrays.chunk(flattened.points, CHUNK_SIZE).reduce(async (promise, rows, i) => {
    await promise;

    const range = `${i * CHUNK_SIZE}-${i * CHUNK_SIZE + rows.length}`;
    Loggers.workers(`Saving Points... (${range})`);

    try {
      await XIV_API.Points.bulkCreate(rows);
    } catch (error) {
      console.log(rows.map((row) => row.id));
      throw error;
    }

    Loggers.workers(`Successfully saved Points! (${range})`);
  }, Promise.resolve());

  await arrays.chunk(flattened.thing_points, CHUNK_SIZE).reduce(async (promise, rows, i) => {
    await promise;

    const range = `${i * CHUNK_SIZE}-${i * CHUNK_SIZE + rows.length}`;
    Loggers.workers(`Saving Thing-Points Associations... (${range})`);

    try {
      await XIV_API.ThingPoints.bulkCreate(rows);
    } catch (error) {
      console.log(rows.filter((row) => !points.find((point) => point.id === row.point_id)));
      throw error;
    }

    Loggers.workers(`Successfully saved Thing-Points Associations! (${range})`);
  }, Promise.resolve());
}
