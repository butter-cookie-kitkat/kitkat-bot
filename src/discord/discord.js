import DiscordJS from 'discord.js';
import { Music } from './music.js';

export class DiscordError extends Error {
  constructor(message) {
    super(message);
  }
}

export class Discord {
  constructor(token) {
    this._client = new DiscordJS.Client();

    this._client.on('error', (error) => console.error(error));

    this._client.login(token);

    this.music = new Music(this._client);
  }

  get userID() {
    return this._client.user && this._client.user.id;
  }

  on(event, listener) {
    this._client.on(event, listener);
  }

  /**
   * @param {string} status The status you'd like to set.
   */
  async setStatus(status) {
    console.log('Updating status...');

    await this._client.user.setActivity(status, {
      type: 'PLAYING'
    });

    console.log('Status updated successfully!');
  }

  async setOffline() {
    await this._client.user.setStatus('invisible');
  }

  async findMessage(channelID, predicate) {
    const channel = await this._client.channels.fetch(channelID);

    if (!channel) {
      throw new DiscordError(`The given channel does not exist! (${channelID})`);
    } else if (channel.type !== 'text') {
      throw new DiscordError(`Expected channel to be a text channel.`);
    }

    const messages = await channel.messages.fetch();

    return messages.find(predicate);
  }
}
