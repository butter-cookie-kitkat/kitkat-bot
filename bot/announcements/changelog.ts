import { AnnouncementJob } from './types';

import { service as Changelog } from '../services/changelog';

export const MARKER = 'kitkat-bot.announcements.changelog';

/**
 * Returns the changelog announcement.
 */
export const changelog: AnnouncementJob = async () => ({
  message: await Changelog.changelog(),
  marker: 'kitkat-bot.announcements.changelog',
});
