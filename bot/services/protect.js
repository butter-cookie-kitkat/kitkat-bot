import { Messages } from './messages';

export class Protect {
  /**
   * Automatically determines if the user is in a voice channel we can join.
   *
   * @param {import('discord.js').Message} message - The discord message.
   * @returns {import('discord.js').Message} the message reply.
   */
  static async voice(message) {
    if (!message.guild) {
      return await message.reply(Messages.DMS_NOT_ALLOWED);
    }

    if (!message.member.voice.channelID) {
      return await message.reply(Messages.NOT_IN_VOICE_CHANNEL);
    }

  }
}
