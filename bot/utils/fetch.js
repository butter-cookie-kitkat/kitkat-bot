import fetch from 'node-fetch';

/**
 * Fetches the response from the given url.
 *
 * @param {import('node-fetch').RequestInfo} url - the url to fetch.
 * @param {import('node-fetch').RequestInit} options - the fetch options.
 * @returns {any} the response.
 */
export async function Fetch(url, options) {
  const response = await fetch(url, options);

  const content = (response.headers.get('content-type') || '').includes('application/json') ? await response.json() : await response.text();

  return response.status >= 400 ? Promise.reject(content) : Promise.resolve(content);
}
