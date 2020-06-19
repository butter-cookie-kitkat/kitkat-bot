import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import { retry } from './promise';

/**
 * Appends query params to the given url.
 *
 * @param url - the url to append query params to.
 * @param params - the query params to append.
 * @returns the built url.
 */
export function buildUrl(url: string, params?: QueryParams): string;
export function buildUrl(url: RequestInfo, params?: QueryParams): RequestInfo;
export function buildUrl(url: RequestInfo, params?: QueryParams): (string|RequestInfo) {
  if (typeof(url) === 'string') {
    const formattedParams = Object.entries(params || {})
      .filter(([, value]) => Boolean(value))
      .map(([key, value]) => `${key}=${encodeURIComponent(Array.isArray(value) ? value.join(',') : value)}`)
      .join('&');

    if (formattedParams) {
      return `${url}${url.includes('?') ? '&' : '?'}${formattedParams}`;
    }
  }

  return url;
}

/**
 * Fetches the response from the given url.
 *
 * @param url - the url to fetch.
 * @param options - the fetch options.
 * @returns the response.
 */
export function Fetch(url: RequestInfo, options: EnhancedRequestInit = {}): Promise<any> {
  const builtUrl = buildUrl(url, options.query);

  return retry(async () => {
    const response = await fetch(builtUrl, options);

    const content = (response.headers.get('content-type') || '').includes('application/json') ? await response.json() : await response.text();

    return response.status >= 400 ? Promise.reject(content) : Promise.resolve(content);
  }, options.retry);

}

export interface EnhancedRequestInit extends RequestInit {
  query?: QueryParams;

  retry?: number;
}

export type QueryParams = {
  [key: string]: any;
}
