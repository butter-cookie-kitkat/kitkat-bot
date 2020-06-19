import { database } from '../database';

class Announcements {
  /**
   * Returns an announcement with the given marker.
   *
   * @param marker - the marker key.
   * @returns the anouncement with the given marker.
   */
  async get(marker: string): Promise<Announcement> {
    const { Announcements } = await database();

    return Announcements.findOne({
      where: {
        marker,
      },
      raw: true,
    });
  }


  /**
   * Saves an announcement.
   *
   * @param item - the announcement to save.
   * @returns the anouncement with the given marker.
   */
  async save(item: Announcement): Promise<void> {
    const { Announcements } = await database();

    await Announcements.upsert(item);
  }
}

export const service = new Announcements();

export interface Announcement {
  /**
   * the message identifier
   */
  marker: string;

  /**
   * the discord message id.
   */
  message_id: string;
}
