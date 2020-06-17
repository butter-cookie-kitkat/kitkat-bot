import { database } from '../database';

/**
 * @typedef {Object} Announcement
 * @property {string} message_id - the discord message id.
 * @property {string} marker - the unique marker.
 */

export class Announcements {
  /**
   * Returns an announcement with the given marker.
   *
   * @param {string} marker - the marker key.
   * @returns {Promise<Announcement>} the anouncement with the given marker.
   */
  static async get(marker) {
    const { announcement } = await database();

    return announcement.findOne({
      where: {
        marker,
      },
      raw: true,
    });
  }

  
  /**
   * Saves an announcement.
   *
   * @param {Announcement} item - the announcement to save.
   * @returns {Promise<void>} the anouncement with the given marker.
   */
  static async save(item) {
    const { announcement } = await database();

    await announcement.upsert(item);
  }
}
