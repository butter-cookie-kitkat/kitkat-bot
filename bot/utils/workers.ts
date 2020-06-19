import { isMainThread, Worker } from 'worker_threads';

class Workers {
  /**
   * Starts a worker thread for the given file.
   *
   * @param file - the file to start a worker for.
   * @param args - the arguments to provide to the worker.
   */
  async start(file: string, ...args: any[]): Promise<any> {
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

export const workers = new Workers();
