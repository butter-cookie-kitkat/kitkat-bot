import { isMainThread, parentPort, workerData } from 'worker_threads';
import { BaseWorker } from './base';
import { FFXIV } from '../services/ffxiv';

export class FFXIVWorker extends BaseWorker {
  async run(recipe, crafter) {
    if (isMainThread) {
      return super.run(require.resolve('./ffxiv.js'), recipe, crafter);
    } else {
      const [recipe, crafter] = workerData;

      const solution = await FFXIV.solve(recipe, crafter.level, crafter.craftsmanship, crafter.control, crafter.cp);
      parentPort.postMessage(solution);
    }
  }
}

export const worker = new FFXIVWorker();

if (!isMainThread) {
  worker.run();
}
