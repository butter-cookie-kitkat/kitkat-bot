import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core-discord';
import DiscordJS from 'discord.js'; // eslint-disable-line no-unused-vars
import { DiscordError } from './discord.js';
import * as Debounce from '../utils/debounce.js';
import { Random } from '../utils/random.js';

export const AUTO_LEAVE_EFFECTS = [
  'faku',
  'startupbass',
  'titanic',
  'violin',
  'wtf',
];

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

    try {
      this._voiceChannel = channel;
      this._connection = await this._voiceChannel.join();
    } catch (error) {
      this.clear();

      throw error;
    }
  }

  async leave(auto) {
    if (auto && Random.boolean(10)) {
      await this.effect(this._voiceChannel.id, Random.item(AUTO_LEAVE_EFFECTS));
    }

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
      url: songInfo.video_url,
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
      duration: Number(songInfo.length_seconds) * 1000,
      timeElapsed: 0,
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
        highWaterMark: 1<<25,
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
      Debounce.debounce('auto-leave', () => this.leave(true));
    }
  }

  get effects() {
    if (!this._effects) {
      this._effects = fs.readdirSync('./effects').reduce((output, file) => {
        const extension = path.extname(file);
        const name = path.basename(file, extension);
        const types = {
          ogg: 'ogg/opus',
          webm: 'webm/opus',
        };

        output[name] = {
          path: `./effects/${file}`,
          type: types[extension.replace('.', '')] || 'mp3',
        };
        return output;
      }, {});
    }

    return this._effects;
  }

  get publicEffects() {
    if (!this._publicEffects) {
      this._publicEffects = {...this.effects};

      for (const name of Object.keys(this._publicEffects)) {
        if (name.includes('private.')) {
          delete this._publicEffects[name];
        }
      }
    }

    return this._publicEffects;
  }

  async effect(channelID, name, allowPrivate) {
    Debounce.clear('auto-leave');
    const effect = allowPrivate ? this.effects[name] : this.publicEffects[name];

    if (!effect) {
      throw new DiscordError(
        `The given effect doesn't exist. (${name})`,
        `Whoops looks like that effect doesn't exist!`,
      );
    }

    await this.pause();

    if (!this._voiceChannel) {
      await this.join(channelID);
    }

    const dispatcher = await this._connection.play(path.resolve(effect.path), {
      volume: false,
    });

    return new Promise((resolve, reject) => {
      dispatcher.on('finish', async () => {
        if (this.songs.length === 0) {
          Debounce.debounce('auto-leave', () => this.leave(true));
        } else {
          await this.play(this.songs[0]);
        }
        resolve();
      }).on('error', (error) => {
        console.error(error);
        reject(error);
      });
    });
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
    return [...this._songs].map((song, index) => {
      const isCurrentSong = index === 0;
      let timeElapsed, timeRemaining;

      if (isCurrentSong) {
        timeElapsed = this._connection && this._connection.dispatcher && this._connection.dispatcher.streamTime;
        timeRemaining = song.duration - song.timeElapsed;
      } else {
        timeElapsed = 0;
        timeRemaining = song.duration;
      }

      return {
        ...song,
        number: index + 1,
        isCurrentSong,
        timeElapsed,
        timeRemaining,
      };
    });
  }
}
