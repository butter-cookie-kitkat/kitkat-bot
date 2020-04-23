import fetch from 'node-fetch';

/**
 * @param {RequestInfo} url
 * @param {RequestInit} options 
 */
export async function Fetch(url, options) {
    const response = await fetch(url, options);

    const content = (response.headers.get('content-type') || '').includes('application/json') ? await response.json() : await response.text();

    return response.status >= 400 ? Promise.reject(content) : Promise.resolve(content);
}