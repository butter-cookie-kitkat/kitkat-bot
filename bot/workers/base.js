import { isMainThread, Worker } from 'worker_threads';

export class BaseWorker {
  run(file, ...args) {
    if (!isMainThread) throw new Error(`A worker can only be executed from the main thread!`);

    return new Promise((resolve, reject) => {
      const worker = new Worker(file, {
        workerData: args,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
}
