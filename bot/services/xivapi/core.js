import { Fetch } from '../../utils/fetch';

export class Core {
  #key;

  constructor(key) {
    this.#key = key;
  }

  getPage = (url, page = 1) => {
    return Fetch(url, {
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
