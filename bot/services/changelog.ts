import { Fetch } from '../utils/fetch';
import parser from 'conventional-commits-parser';
import { outdent } from 'outdent';

const FIX = 'fix';
const FEAT = 'feat';

export const DISCORD_AUTHOR: {
  [key: string]: string;
} = {
  'Nick Woodward': '<@203949397271117824>',
};

export const ORDER: CommitTypes[] = [
  FEAT,
  FIX,
];

export const TYPE_HEADERS = {
  [FIX]: 'Bug Fixes',
  [FEAT]: 'Features',
};

export class Changelog {
  #changelog?: GroupedCommits;

  private async fetch(): Promise<GroupedCommits> {
    if (!this.#changelog) {
      const commits = await Fetch('https://api.github.com/repos/butter-cookie-kitkat/kitkat-bot/commits');

      this.#changelog = commits
        .filter(({ commit }: any) => !commit.author.name.includes('dependabot'))
        .map(({ commit }: any) => ({
          ...parser.sync(commit.message),
          author: commit.author,
        }))
        .filter((commit: any) => ['fix', 'feat'].includes(commit.type))
        .map((commit: any): Commit => ({
          type: commit.type,
          message: commit.subject,
          author: commit.author.name,
        }))
        .slice(0, 5)
        .reduce((output: GroupedCommits, commit: Commit) => {
          output[commit.type].push(commit);
          return output;
        }, { fix: [], feat: [] } as GroupedCommits);
    }

    return this.#changelog as GroupedCommits;
  }

  async changelog(): Promise<string> {
    return outdent`
      **Recent Changes**

      ${this.groups(await this.fetch())}
    `;
  }

  private groups(changes: GroupedCommits) {
    return ORDER
      .map((type) => {
        const commits = changes[type];

        if (!commits) return null;

        return this.group(type, commits);
      })
      .filter((commits) => Boolean(commits))
      .join('\r\n\r\n');
  }

  private group(type: CommitTypes, commits: Commit[]) {
    if (!commits) return null;

    return outdent`
      **~-~ ${TYPE_HEADERS[type]} ~-~**

      ${commits.map((commit) => this.commit(commit)).join('\r\n')}
    `
  }

  private commit(commit: Commit) {
    const author = DISCORD_AUTHOR[commit.author] || commit.author;

    return outdent`
      - ${commit.message} (by ${author})
    `;
  }
}

export const service = new Changelog();

export type CommitTypes = ('fix'|'feat');

export interface Commit {
  type: CommitTypes;
  message: string;
  author: string;
}

export type GroupedCommits = {
  fix: Commit[];
  feat: Commit[];
}
