import { Fetch, EnhancedRequestInit } from '../../utils/fetch';
import { CONFIG } from '../../config';

export class Core {
  private key: (null|string);

  constructor(key: (null|string)) {
    this.key = key;
  }

  /**
   * Append the xivapi url to the beginning.
   *
   * @param url - the url to format.
   * @returns either the staging or live url depending on the url and environment.
   */
  url(url: string, is_live: boolean = CONFIG.IS_LIVE): string {
    if (url.match(/^\/(?:m|i)\//i) || is_live) return `https://xivapi.com${url}`;
    else return `https://staging.xivapi.com${url}`;
  }

  /**
   * Requests information from a given xivapi url.
   *
   * @param url - the url to request.
   * @param options - the fetch options.
   * @returns the api data.
   */
  fetch(url: string, options: EnhancedRequestInit = {}): Promise<any> {
    return Fetch(this.url(url), {
      ...options,
      query: {
        ...options.query,
        private_key: this.key,
      },
    });
  }

  /**
   * Retrieves the paginated results for a given url at a given page.
   *
   * @param url - the url to access
   * @param page - the page number to access
   * @returns the requested information for a given page number.
   */
  getPage(url: string, page = 1): Promise<Page> {
    return this.fetch(url, {
      query: {
        page,
      },
      retry: -1,
    });
  }

  /**
   * Retrieves all of the pages for a given API.
   *
   * @param url - the FFXIV api url.
   * @returns the results of every page.
   */
  async getAllPages(url: string): Promise<any[]> {
    const { Pagination, Results } = await this.getPage(url);

    const results = await Promise.all(Array(Pagination.PageTotal - 1).fill(null).map(async (_, index) => {
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

export interface Page {
  Pagination: {
    Page: number;
    PageNext: number;
    PagePrev: number;
    PageTotal: number;
    Results: number;
    ResultsPerPage: number;
    ResultsTotal: number;
  };

  Results: any[];
}
