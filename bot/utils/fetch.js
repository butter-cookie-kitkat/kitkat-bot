import fetch from 'node-fetch';

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
 * @returns {Promise<T>} the callback response
 */
export async function retry(cb, count = 3) {
  try {
    return cb();
  } catch (error) {
    if (count !== 0) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return retry(cb, count - 1);
    }

    throw error;
  }
}

/**
 * @param url
 * @param params
 */
export function buildUrl(url, params) {
  const formattedParams = Object.entries(params || {})
    .map(([key, value]) => `${key}=${encodeURIComponent(Array.isArray(value) ? value.join(',') : value)}`)
    .join('&');

  if (formattedParams) {
    return `${url}${url.includes('?') ? '&' : '?'}${formattedParams}`;
  }

  return url;
}

/**
 * Fetches the response from the given url.
 *
 * @param {import('node-fetch').RequestInfo} url - the url to fetch.
 * @param {import('node-fetch').RequestInit} options - the fetch options.
 * @returns {any} the response.
 */
export async function Fetch(url, options) {
  options = options || {};

  const builtUrl = buildUrl(url, options.query);
  const response = await retry(() => fetch(builtUrl, options), options.retry);

  const content = (response.headers.get('content-type') || '').includes('application/json') ? await response.json() : await response.text();

  return response.status >= 400 ? Promise.reject(content) : Promise.resolve(content);
}
