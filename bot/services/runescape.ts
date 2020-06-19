import cheerio from 'cheerio';
import { Fetch } from '../utils/fetch';
import { getText } from '../utils/cheerio';

export const ITEM = 'item';
export const MEMBERS = 'members';
export const PRICE = 'price';
export const CHANGE = 'change';

export const HEADERS_TO_PROPERTY_NAME = {
  'Item': ITEM,
  'Members Only': MEMBERS,
  'Price': PRICE,
  'Change': CHANGE,
};

export interface Result {
  /**
   * the item name.
   */
  item: string;

  /**
   * whether the item is members only.
   */
  members: string;

  /**
   * The price of the item.
   */
  price: string;

  /**
   * The change in price that's occurred recently.
   */
  change: string;
}

export interface Response {
  columns: string[];
  results: Result[];
}

/**
 * Parses the given html into a generic response.
 *
 * @param html - the html to parse.
 * @returns the parsed response object.
 */
function convertResultsToJSON(html: string): Response {
  const $ = cheerio.load(html);

  const columns = $('.content > table > thead > tr > th').toArray().map((item) => {
    return item.children
      .map((child) => {
        if (child.type === 'text') {
          return child.data;
        } else if (child.attribs.title) {
          return child.attribs.title;
        } else if (child.attribs.alt) {
          return child.attribs.alt;
        }

        return null;
      })
      .filter((child) => Boolean(child))
      .join(' ');
  });

  return {
    columns,
    results: $('.content > table > tbody > tr').toArray().map((row) => {
      const [name, members, price, change] = $(row).find('td').toArray();

      return {
        [ITEM]: $(name).find('img').get(0).attribs.alt,
        [MEMBERS]: getText(members) === 'Members Only' ? 'Yes' : 'No',
        [PRICE]: getText(price),
        [CHANGE]: getText(change),
      };
    }),
  };
}

export class RS3 {
  /**
   * Searches for an item with the given name on the RS3 GE.
   *
   * @param name - the name of the item.
   * @returns the search results.
   */
  static async search(name: string): Promise<Response> {
    return convertResultsToJSON(await Fetch(`http://services.runescape.com/m=itemdb_rs/results.ws?query=${name}&price=all`));
  }
}

export class OSRS {
  /**
   * Searches for an item with the given name on the OSRS GE.
   *
   * @param name - the name of the item.
   * @returns the search results.
   */
  static async search(name: string): Promise<Response> {
    return convertResultsToJSON(await Fetch(`http://services.runescape.com/m=itemdb_oldschool/results.ws?query=${name}`));
  }
}
