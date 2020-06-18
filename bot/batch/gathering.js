
import * as Loggers from '../utils/loggers';
import { math } from '../utils/math';
import { database } from '../database';
import { Arrays } from '../utils/arrays';
import { xivapi } from '../services/xivapi';

/**
 *
 */
export async function gathering() {
  const { xivapi_points, xivapi_things, xivapi_thing_points } = await database();

  const info = await xivapi.dump.gatheringInfo();

  Loggers.workers('Destroying Thing-Points Associations...');

  await xivapi_thing_points.destroy({
    truncate: true,
    cascade: true,
  });

  Loggers.workers('Destroying Things...');

  await xivapi_things.destroy({
    truncate: true,
    cascade: true,
  });

  Loggers.workers('Destroying Points...');

  await xivapi_points.destroy({
    truncate: true,
    cascade: true,
  });

  let { points, things, thing_points } = info.reduce((output, row) => {
    const points = row.locations.length ? row.locations.reduce((output, location) => {
      return output.concat(location.nodes.map((node) => ({
        id: `${node.node_id}-${node.x}-${node.y}`,
        map_id: node.map_id,
        x: node.x,
        y: node.y,
      })));
    }, []) : [];

    const thing = {
      id: `Item-${row.id}`,
      type: 'Item',
      name: row.name,
      hidden: row.hidden,
    };

    const thing_points = points.map((point) => ({
      thing_id: thing.id,
      point_id: point.id,
    }));

    output.points = output.points.concat(points);
    output.thing_points = output.thing_points.concat(thing_points);
    output.things.push(thing);

    return output;
  }, { things: [], points: [], thing_points: [] });

  points = Arrays.unique(points, (item) => item.id);
  thing_points = Arrays.unique(thing_points, (item) => `${item.thing_id}.${item.point_id}`);

  const CHUNK_SIZE = 100;
  await Arrays.chunk(things, CHUNK_SIZE).reduce(async (promise, rows, i) => {
    await promise;

    const range = `${i * CHUNK_SIZE}-${i * CHUNK_SIZE + rows.length}`;
    Loggers.workers(`Saving Things... (${range})`);

    try {
      await xivapi_things.bulkCreate(rows);
    } catch (error) {
      console.log(rows.map((row) => row.id));
      throw error;
    }

    Loggers.workers(`Successfully saved Things! (${range})`);
  }, Promise.resolve());

  await Arrays.chunk(points, CHUNK_SIZE).reduce(async (promise, rows, i) => {
    await promise;

    const range = `${i * CHUNK_SIZE}-${i * CHUNK_SIZE + rows.length}`;
    Loggers.workers(`Saving Points... (${range})`);

    try {
      await xivapi_points.bulkCreate(rows);
    } catch (error) {
      console.log(rows.map((row) => row.id));
      throw error;
    }

    Loggers.workers(`Successfully saved Points! (${range})`);
  }, Promise.resolve());

  await Arrays.chunk(thing_points, CHUNK_SIZE).reduce(async (promise, rows, i) => {
    await promise;

    const range = `${i * CHUNK_SIZE}-${i * CHUNK_SIZE + rows.length}`;
    Loggers.workers(`Saving Thing-Points Associations... (${range})`);

    try {
      await xivapi_thing_points.bulkCreate(rows);
    } catch (error) {
      console.log(rows.filter((row) => !points.find((point) => point.id === row.point_id)));
      throw error;
    }

    Loggers.workers(`Successfully saved Thing-Points Associations! (${range})`);
  }, Promise.resolve());
}
