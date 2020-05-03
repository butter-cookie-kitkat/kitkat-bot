import cheerio from 'cheerio';
import { Fetch } from '../utils/fetch.js';
import { getText } from '../utils/cheerio.js';

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

export function convertResultsToJSON(html) {
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
  static get headerToProperty() {
    return {
      'Item': ITEM,
      'Members Only': MEMBERS,
      'Price': PRICE,
      'Change': CHANGE,
    };
  }

  static async search(name) {
    return convertResultsToJSON(await Fetch(`http://services.runescape.com/m=itemdb_rs/results.ws?query=${name}&price=all`));
  }
}

export class OSRS {
  static async search(name) {
    return convertResultsToJSON(await Fetch(`http://services.runescape.com/m=itemdb_oldschool/results.ws?query=${name}`));
  }
}
