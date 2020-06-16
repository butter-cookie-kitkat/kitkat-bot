import fetch from 'node-fetch';
import { retry } from './promise';

/**
 * @param url
 * @param params
 */
export function buildUrl(url, params) {
  const formattedParams = Object.entries(params || {})
    .filter(([, value]) => Boolean(value))
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
export function Fetch(url, options) {
  options = options || {};

  const builtUrl = buildUrl(url, options.query);

  return retry(async () => {
    const response = await fetch(builtUrl, options);

    const content = (response.headers.get('content-type') || '').includes('application/json') ? await response.json() : await response.text();

    return response.status >= 400 ? Promise.reject(content) : Promise.resolve(content);
  }, options.retry);

}
