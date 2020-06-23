import { AnnouncementJob } from './types';

import { service as Changelog, ORDER, TYPE_HEADERS, DISCORD_AUTHOR } from '../services/changelog';
import { embeds } from '../utils/embeds';
import { format } from '../utils/formatters';

export const MARKER = 'kitkat-bot.announcements.changelog';

/**
 * Returns the changelog announcement.
 */
export const changelog: AnnouncementJob = async () => {
  const commits = await Changelog.fetch(20);

  return {
    message: embeds.success({
      title: 'Recent Changes',
      fields: ORDER.map((name) => ({
        name: format(TYPE_HEADERS[name]).bold.toString(),
        value: commits[name].map((commit) => `- (${commit.scope}): ${commit.message} (by ${DISCORD_AUTHOR[commit.author] || commit.author})`).join('\r\n'),
        inline: false,
      })),
    }),
    marker: 'kitkat-bot.announcements.changelog',
  };
};
