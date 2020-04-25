import ytdl from 'ytdl-core-discord';
import DiscordJS from 'discord.js';

export class Music {
  /**
   * @param {DiscordJS.Client} client The discord bot client.
   */
  constructor(client) {
    this._client = client;

    this.clear();
  }

  clear() {
    this._connection = null;
    /** @type {DiscordJS.VoiceChannel} */
    this._voiceChannel = null;
    this._songs = [];
  }

  /**
   * @param {String} channelID The voice channel id to join.
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
    const songInfo = await ytdl.getInfo(url);

    const song = {
      title: songInfo.title,
      url: songInfo.video_url
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
      this.leave();
    }
  }

  get isInVoiceChannel() {
    return !!this._voiceChannel;
  }

  get songs() {
    return [...this._songs];
  }
}
