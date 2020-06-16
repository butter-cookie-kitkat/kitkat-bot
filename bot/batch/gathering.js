
import * as Loggers from '../utils/loggers';
import { math } from '../utils/math';
import { database } from '../database';
import { Arrays } from '../utils/arrays';
import { xivapi } from '../services/xivapi';

/**
 *
 */
export async function gathering() {
  const info = await xivapi.dump.gatheringInfo();
  Loggers.workers(`Generating chunks from rows... (${info.length})`);

  const CHUNK_SIZE = 100;

  const chunks = Arrays.chunk(info.map((gatheringInfo) => {
    const nodes = gatheringInfo.location.nodes || [];

    const { x, y } = nodes.reduce((output, node) => {
      output.x.push(node.x);
      output.y.push(node.y);

      return output;
    }, { x: [], y: [] });

    return {
      id: gatheringInfo.id,
      name: gatheringInfo.name,
      hidden: gatheringInfo.hidden,
      type: gatheringInfo.type,
      map_image: gatheringInfo.location.map_image,
      zone: gatheringInfo.location.zone,
      region: gatheringInfo.location.region,
      place: gatheringInfo.location.place,
      x: math.center(...x),
      y: math.center(...y),
    };
  }), CHUNK_SIZE);

  Loggers.workers(`Chunks generated successfully! (${chunks.length})`);

  const { gathering } = await database();

  Loggers.workers('Destroying old rows!');

  await gathering.destroy({
    truncate: true,
  });

  for (let i = 0; i < chunks.length; i++) {
    const rows = chunks[i];
    const range = `${i * CHUNK_SIZE}-${i * CHUNK_SIZE + rows.length}`;

    Loggers.workers(`Saving Gathering Info Rows... (${range})`);

    try {
      await gathering.bulkCreate(rows);
    } catch (error) {
      console.log(rows.map((row) => row.id));
      throw error;
    }

    Loggers.workers(`Successfully saved gathering rows! (${range})`);
  }
}
