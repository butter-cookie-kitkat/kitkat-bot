import { Fetch } from '../utils/fetch';
import parser from 'conventional-commits-parser';
import { outdent } from 'outdent';

const FIX = 'fix';
const FEAT = 'feat';

export const DISCORD_AUTHOR = Object.entries({
  'Nick Woodward': '203949397271117824',
}).reduce((output, [name, id]) => {
  output[name] = `<@${id}>`;
  return output;
}, {});

export const ORDER = [
  FEAT,
  FIX,
];

export const TYPE_HEADERS = {
  [FIX]: 'Bug Fixes',
  [FEAT]: 'Features',
};

export class Changelog {
  static #changelog;

  static async fetch() {
    if (!Changelog.#changelog) {
      const commits = await Fetch('https://api.github.com/repos/butter-cookie-kitkat/kitkat-bot/commits');

      Changelog.#changelog = commits
        .filter(({ commit }) => !commit.author.name.includes('dependabot'))
        .map(({ commit }) => ({
          ...parser.sync(commit.message),
          author: commit.author,
        }))
        .filter((commit) => ['fix', 'feat'].includes(commit.type))
        .map((commit) => ({
          type: commit.type,
          message: commit.subject,
          author: commit.author,
        }))
        .slice(0, 5)
        .reduce((output, commit) => {
          output[commit.type] = output[commit.type] || [];
          output[commit.type].push(commit);
          return output;
        }, {});
    }

    return Changelog.#changelog;
  }

  static async changelog() {
    return outdent`
      **Recent Changes**

      ${Changelog.groups(await this.fetch())}
    `;
  }

  static groups(changes) {
    return ORDER
      .map((type) => {
        const commits = changes[type];

        if (!commits) return null;

        return Changelog.group(type, commits);
      })
      .filter((commits) => Boolean(commits))
      .join('\r\n\r\n');
  }

  static group(type, commits) {
    if (!commits) return null;

    return outdent`
      **~-~ ${TYPE_HEADERS[type]} ~-~**

      ${commits.map((commit) => Changelog.commit(commit)).join('\r\n')}
    `
  }

  static commit(commit) {
    const author = DISCORD_AUTHOR[commit.author.name] || commit.author.name;

    return outdent`
      - ${commit.message} (by ${author})
    `;
  }
}
