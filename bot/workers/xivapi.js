import { isMainThread, parentPort, workerData } from 'worker_threads';
import { BaseWorker } from './base';
import { xivapi } from '../services/xivapi';

export class XIVAPIWorker extends BaseWorker {
  async run() {
    if (isMainThread) {
      return super.run(require.resolve('./xivapi.js'));
    } else {
      const gatheringInfo = await xivapi.dump.gatheringInfo();

      parentPort.postMessage(gatheringInfo);
    }
  }
}

export const worker = new XIVAPIWorker();

if (!isMainThread) {
  worker.run();
}
