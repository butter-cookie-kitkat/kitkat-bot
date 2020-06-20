import { MessageEmbed } from 'discord.js';

export interface Announcement {
  /**
   * the message identifier
   */
  marker: string;

  /**
   * the message to announce
   */
  message: MessageEmbed;
}

export type AnnouncementJob = () => Promise<Announcement>;
