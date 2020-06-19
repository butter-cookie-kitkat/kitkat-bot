export interface Announcement {
  /**
   * the message identifier
   */
  marker: string;

  /**
   * the message to announce
   */
  message: string;
}

export type AnnouncementJob = () => Promise<Announcement>;
