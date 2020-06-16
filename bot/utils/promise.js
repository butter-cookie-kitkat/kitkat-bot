/**
 * @template T
 * @callback RetryFunction
 * @returns {Promise<T>}
 */

/**
 * Retries an async callback.
 *
 * @template T
 * @param {RetryFunction<T>} cb - the async callback
 * @param {number} count - the number of remaining retries
 * @param {number} delay - the delay in ms between each retry
 * @returns {Promise<T>} the callback response
 */
export async function retry(cb, count = 3, delay = 3000) {
  while (count !== 0) {
    try {
      return await cb();
    } catch (error) {
      count--;

      if (count == 0) {
        console.error('Call count exceeded...');
        throw error;
      }

      await wait(delay);
    }
  }
}

/**
 * Waits a certain amount of time.
 *
 * @param {number} delay - the amount of time to wait
 */
export async function wait(delay) {
  await new Promise((resolve) => setTimeout(resolve, delay));
}
