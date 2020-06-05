import { Changelog } from '../services/changelog';

export const MARKER = 'kitkat-bot.announcements.changelog';

/**
 * Returns the changelog announcement.
 *
 * @returns {Promise<Announcement>} the announcement
 */
export async function changelog() {
  return {
    message: await Changelog.changelog(),
    marker: MARKER,
  };
}
