/**
 * Retries an async callback.
 *
 * @param cb - the async callback.
 * @param count - the number of times to retry.
 * @param delay - the delay in ms between each retry.
 * @returns the callback response.
 */
export async function retry<T>(cb: RetryCallback<T>, count = 3, delay = 3000): Promise<(null|T)> {
  while (count !== 0) {
    try {
      return await cb();
    } catch (error) {
      count--;

      if (count == 0) throw error;

      await wait(delay);
    }
  }

  return null;
}

/**
 * Waits a certain amount of time.
 *
 * @param delay - the amount of time to wait (in ms)
 * @returns a promise that resolves after the wait time.
 */
export async function wait(delay: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export type RetryCallback<T> = () => Promise<T>;
