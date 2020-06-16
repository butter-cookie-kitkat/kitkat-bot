import { Fetch } from '../../utils/fetch';
import { CONFIG } from '../../config';

export class Core {
  #key;

  constructor(key) {
    this.#key = key;
  }

  url(url) {
    if (CONFIG.IS_LIVE) return `https://xivapi.com${url}`;
    else return `https://staging.xivapi.com${url}`;
  }

  getPage(url, page = 1) {
    return Fetch(this.url(url), {
      query: {
        private_key: this.#key,
        page,
      },
      retry: -1,
    });
  }

  /**
   * Retrieves all of the pages for a given API.
   *
   * @param {string} url - the FFXIV api url.
   * @returns {any[]} the results of every page.
   */
  async getAllPages(url) {
    const { Pagination, Results } = await this.getPage(url);

    const results = await Promise.all(Array(Pagination.PageTotal - 1).fill().map(async (_, index) => {
      const page = await this.getPage(url, index + 2);

      return page.Results;
    }));

    return [
      ...Results,
      ...results.reduce((output, results) => ([
        ...output,
        ...results,
      ]), []),
    ];
  }
}
