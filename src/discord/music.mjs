import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core-discord';
import DiscordJS from 'discord.js';
import { DiscordError } from './discord.mjs';
import * as Debounce from '../utils/debounce.mjs';

export const effects = {
  ayaya: './sound-effects/ayaya-ayaya.mp3'
};

export class Music {
  /**
   * @param {DiscordJS.Client} client The discord bot client.
   */
  constructor(client) {
    this._client = client;

    this.clear();
  }

  clear() {
    /** @type {DiscordJS.VoiceConnection} */
    this._connection = null;
    /** @type {DiscordJS.VoiceChannel} */
    this._voiceChannel = null;
    this._songs = [];
  }

  /**
   * @param {String} channelID The voice channel id to join.
   * @param {Boolean} [cache] If the voice channel info should be cached.
   * @return {DiscordJS.VoiceConnection} The requested channel.
   */
  async join(channelID) {
    const channel = await this._client.channels.fetch(channelID);

    if (!channel) {
      throw new DiscordError(`The given channel does not exist! (${channelID})`);
    }

    if (channel.type !== 'voice') {
      throw new DiscordError(`Expected channel to be a voice channel.`);
    }

    this._voiceChannel = channel;
    this._connection = await this._voiceChannel.join();
  }

  leave() {
    this._voiceChannel.leave();
    this.clear();
  }

  skip() {
    if (this._connection && this._connection.dispatcher) {
      this._connection.dispatcher.end();
    }
  }

  stop() {
    this._songs = [];
    this._connection.dispatcher.end();
  }

  async unshift(url) {
    const songInfo = await ytdl.getInfo(url);

    const song = {
      title: songInfo.title,
      url: songInfo.video_url
    };

    this._songs.unshift(song);

    if (this._songs.length === 1) {
      this.play(this._songs[0]);
    }

    return song;
  }

  async push(url) {
    Debounce.clear('auto-leave');

    const songInfo = await ytdl.getInfo(url);

    const song = {
      title: songInfo.title,
      url: songInfo.video_url,
      duration: songInfo.length_seconds,
      timeElapsed: 0
    };

    this._songs.push(song);

    if (this._songs.length === 1) {
      this.play(this._songs[0]);
    }

    return song;
  }

  async play(song) {
    if (song) {
      const dispatcher = this._connection.play(await ytdl(song.url, {
        highWaterMark: 1<<25
      }), { type: 'opus' });

      dispatcher
        .on('finish', () => {
          this._songs.shift();
          this.play(this._songs[0]);
        })
        .on('error', (error) => {
          this._songs.shift();
          this.play(this._songs[0]);
          console.error(error);
        });
    } else {
      Debounce.debounce('auto-leave', () => this.leave());
    }
  }

  get effects() {
    if (!this._effects) {
      this._effects = fs.readdirSync('./effects').reduce((output, file) => {
        const [name, extension] = file.split('.');
        const types = {
          ogg: 'ogg/opus',
          webm: 'webm/opus'
        };

        output[name] = {
          path: `./effects/${file}`,
          type: types[extension] || 'mp3'
        };
        return output;
      }, {});
    }

    return this._effects;
  }

  async effect(channelID, name) {
    Debounce.clear('auto-leave');
    await this.pause();

    if (!this._voiceChannel) {
      await this.join(channelID);
    }

    const effect = this.effects[name];
    if (effect) {
      const dispatcher = await this._connection.play(path.resolve(effect.path), {
        volume: false
      });

      dispatcher.on('finish', async () => {
        if (this.songs.length === 0) {
          Debounce.debounce('auto-leave', () => this.leave());
        } else {
          await this.play(this.songs[0]);
        }
      }).on('error', console.error);
    } else {
      throw new DiscordError(`The given effect doesn't exist. (${name})`);
    }
  }

  async pause() {
    if (this._connection && this._connection.dispatcher) {
      this._connection.dispatcher.pause();
    }
  }

  async resume() {
    if (this._connection && this._connection.dispatcher) {
      this._connection.dispatcher.resume();
    }
  }

  get isInVoiceChannel() {
    return !!this._voiceChannel;
  }

  get songs() {
    return [...this._songs];
  }
}
