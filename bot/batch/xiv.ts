import * as Loggers from '../utils/loggers';
import { arrays } from '../utils/arrays';
import { xivapi } from '../services/xivapi';
import { service as XIVService } from '../services/xiv';
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
  const maps = await xivapi.extractor.GatheringMaps();

  Loggers.workers('Destroying Thing-Points Associations...');

  await XIVService.clear();

  const flattened = maps.reduce((output, map) =>
    map.GatheringNodes.reduce((output, node) => {
      output.points.push({
        id: node.ID,
        map_id: node.MapID,
        type: node.NodeType,
        icon: node.NodeIcon,
        x: node.PixelX,
        y: node.PixelY,
      });

      output.things.push(...node.Items.map((item) => ({
        id: item.Item.ID,
        type: node.Type,
        name: item.Item.Name,
        hidden: item.IsHidden === 1,
      })));

      output.thing_points.push(...node.Items.map((item) => ({
        point_id: node.ID,
        thing_id: item.Item.ID,
      })));

      return output;
    }, output),
  { things: [], points: [], thing_points: [] } as FlattenedOutput);

  flattened.points = arrays.unique(flattened.points, (item) => item.id);
  flattened.thing_points = arrays.unique(flattened.thing_points, (item) => `${item.thing_id}.${item.point_id}`);
  flattened.things = arrays.unique(flattened.things, (item) => item.id);

  const CHUNK_SIZE = 100;
  await arrays.chunk(flattened.things, CHUNK_SIZE).reduce(async (promise, rows, i) => {
    await promise;

    const range = `${i * CHUNK_SIZE}-${i * CHUNK_SIZE + rows.length}`;
    Loggers.workers(`Saving Things... (${range})`);

    await XIVService.createThings(...rows);

    Loggers.workers(`Successfully saved Things! (${range})`);
  }, Promise.resolve());

  await arrays.chunk(flattened.points, CHUNK_SIZE).reduce(async (promise, rows, i) => {
    await promise;

    const range = `${i * CHUNK_SIZE}-${i * CHUNK_SIZE + rows.length}`;
    Loggers.workers(`Saving Points... (${range})`);

    await XIVService.createPoints(...rows);

    Loggers.workers(`Successfully saved Points! (${range})`);
  }, Promise.resolve());

  await arrays.chunk(flattened.thing_points, CHUNK_SIZE).reduce(async (promise, rows, i) => {
    await promise;

    const range = `${i * CHUNK_SIZE}-${i * CHUNK_SIZE + rows.length}`;
    Loggers.workers(`Saving Thing-Points Associations... (${range})`);

    await XIVService.createThingPoints(...rows);

    Loggers.workers(`Successfully saved Thing-Points Associations! (${range})`);
  }, Promise.resolve());
}
