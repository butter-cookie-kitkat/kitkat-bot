import DiscordJS from 'discord.js'; // eslint-disable-line no-unused-vars

export class Channel {
  /**
   * @param {DiscordJS.Client} client The discord bot client.
   * @param {string} channelID The channel id to join.
   */
  constructor(client, channelID) {
    this._client = client;
    this._channelID = channelID;
  }

  async send(content) {
    /** @type {DiscordJS.TextChannel} */
    const channel = await this._client.channels.fetch(this._channelID);

    await channel.send(content);
  }

  async findMessage(predicate) {
    const channel = await this._client.channels.fetch(this._channelID);

    if (!channel) {
      throw new DiscordError(`The given channel does not exist! (${channelID})`);
    } else if (channel.type !== 'text') {
      throw new DiscordError(`Expected channel to be a text channel.`);
    }

    const messages = await channel.messages.fetch();

    return messages.find(predicate);
  }
}
