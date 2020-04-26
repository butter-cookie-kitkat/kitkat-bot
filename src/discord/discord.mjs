import DiscordJS from 'discord.js';
import { Channel } from './channel.mjs';
import { Music } from './music.mjs';

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

  async channel(channelID) {
    return new Channel(this._client, channelID);
  }
}
