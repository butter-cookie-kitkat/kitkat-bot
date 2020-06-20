import { outdent } from 'outdent';

import { service as EffectsService } from '../services/effects';
import { Messages } from '../services/messages';

import { service as SongsService } from '../services/songs';
import { service as YouTubeService } from '../services/youtube';
import { concat } from '../utils/concat';
import { duration } from '../utils/duration';
import { service as ProtectService } from '../services/protect';
import { CommandRegistrator } from './types';
import { KitkatBotCommandError } from '../types';

/**
 * Adds a song to the queue.
 */
export const play: CommandRegistrator = (bot) => {
  bot.command('play <url>', async ({ message, args }) => {
    const info = ProtectService.voice(message);

    if (!bot.voice.isConnected) {
      await bot.voice.join(info.voiceChannelID);
    }

    const urlInfo = YouTubeService.getUrlInfo(args.url);

    if (!urlInfo) {
      throw new KitkatBotCommandError(Messages.INVALID_YOUTUBE_URL);
    }

    /**
     * Play this as a Playlist if the following is true:
     *  - The URL isn't a video url.
     *  - The Playlist Argument was passed and url is a Playlist url.
     */
    if (urlInfo.video_id && (!args.playlist || !urlInfo.playlist_id)) {
      const song = await YouTubeService.getVideoByID(urlInfo.video_id);

      if (!song) {
        return await message.channel.send(Messages.VIDEO_NOT_FOUND);
      }

      if (args.now) {
        await SongsService.unshift(message.channel.id, song);
      } else {
        await SongsService.add(message.channel.id, song);
      }

      if (bot.voice.isPlaying && !args.now) {
        await message.channel.send(outdent`
          \`${song.title}\` has been added to the queue!
        `);
      }
    } else if (urlInfo.playlist_id) {
      const playlist = await YouTubeService.getPlaylistByID(urlInfo.playlist_id);

      if (!playlist) {
        return await message.channel.send(Messages.PLAYLIST_NOT_FOUND);
      }

      await SongsService.add(message.channel.id, ...playlist.songs);

      if (args.now) {
        throw new KitkatBotCommandError(Messages.STOP_TROLLING);
      }

      await message.channel.send(`The \`${playlist.name}\` Playlist has been added to the queue! (${playlist.songs.length} songs)`);
    }

    if (!bot.voice.isPlaying || args.now) {
      const song = await SongsService.current();

      if (!song) {
        return await message.channel.send(Messages.CURRENT_SONG_NOT_FOUND);
      }

      await bot.voice.play(song.url);
    }
  }).help({
    name: 'play',
    description: 'Adds a song to the queue.',
    group: 'Music',
    args: {
      url: {
        type: 'string',
        description: 'The song url',
      },
      now: {
        type: 'boolean',
        description: 'Whether the song should be played immediately.',
      },
      playlist: {
        type: 'boolean',
        description: 'Whether the whole playlist should be added.',
      },
    },
  });
}

/**
 * Lists all of the songs in the queue.
 */
export const queue: CommandRegistrator = (bot) => {
  bot.command('queue', async ({ message }) => {
    const {
      songs,
      hasMore,
    } = await SongsService.list({ limit: 10 });
    if (songs.length > 0) {
      await message.channel.send(outdent`
        Here's a list of the current songs in the queue.

        ${songs.map((song, index) => concat.join(`${index + 1}) \`${song.title}\``, index === 0 && `<-- Current Track - ${duration.humanize(song.duration - (bot.voice.elapsed || 0))}`)).join('\n')}
        ${hasMore ? '...' : ''}
      `);
    } else {
      await message.channel.send('There are currently no songs in the queue.');
    }
  }).help({
    name: 'queue',
    group: 'Music',
    description: 'Lists all of the songs in the queue.',
  });
}

/**
 * Skips the current song.
 */
export const skip: CommandRegistrator = (bot) => {
  bot.command('skip', async () => {
    if (!bot.voice.isPlaying) {
      throw new KitkatBotCommandError(Messages.NOT_PLAYING_AUDIO);
    }

    bot.voice.stop();
  }).help({
    name: 'skip',
    description: 'Skips the current song.',
    group: 'Music',
  });
}

/**
 * Lists out the available commands.
 */
export const effects: CommandRegistrator = (bot) => {
  bot.command('effects', async ({ message }) => {
    await message.channel.send(outdent`
      Here's a list of all the available sound effects.

      ${Object.keys(EffectsService.public).map((name) => `- ${name}`).join('\r\n')}
    `);
  }).help({
    name: 'effects',
    description: 'Lists all the available effects.',
    group: 'Music',
  });
}

/**
 * Plays a sound effect.
 */
export const effect: CommandRegistrator = (bot) => {
  bot.command('effect <name>', async ({ message, args }) => {
    const info = ProtectService.voice(message);

    const effect = EffectsService.effect(args.name);

    if (!effect) {
      throw new KitkatBotCommandError(Messages.BAD_EFFECT_NAME);
    }

    if (!bot.voice.isConnected) {
      await bot.voice.join(info.voiceChannelID);
    }

    await bot.voice.play(effect.path);
  }).help({
    name: 'effect',
    description: 'Plays a sound effect with the given name.',
    group: 'Music',
    args: {
      name: 'The sound effect name',
    },
  });
}

/**
 * Joins the users voice channel.
 */
export const join: CommandRegistrator = (bot) => {
  bot.command('join', async ({ message }) => {
    const info = ProtectService.voice(message);

    await bot.voice.join(info.voiceChannelID);
  }).help({
    name: 'join',
    description: 'Joins the Voice Chat.',
    group: 'Music',
  });
}

/**
 * Leaves the users voice channel.
 */
export const leave: CommandRegistrator = (bot) => {
  bot.command('leave', async () => {
    if (!bot.voice.isConnected) {
      throw new KitkatBotCommandError(Messages.BOT_NOT_IN_VOICE_CHANNEL);
    }

    await bot.voice.leave();
  }).help({
    name: 'leave',
    description: 'Leaves the Voice Chat.',
    group: 'Music',
  });
}

/**
 * Stops playing audio.
 */
export const stop: CommandRegistrator = (bot) => {
  bot.command('stop', async () => {
    if (!bot.voice.isPlaying) {
      throw new KitkatBotCommandError(Messages.NOT_PLAYING_AUDIO);
    }

    await SongsService.clear();

    await bot.voice.stop();
  }).help({
    name: 'stop',
    description: 'Stops all audio.',
    group: 'Music',
  });
}

/**
 * Pauses the music.
 */
export const pause: CommandRegistrator = (bot) => {
  bot.command('pause', async () => {
    if (!bot.voice.isPlaying) {
      throw new KitkatBotCommandError(Messages.NOT_PLAYING_AUDIO);
    }

    await bot.voice.pause();
  }).help({
    name: 'pause',
    description: 'Pauses the music.',
    group: 'Music',
  });
}

/**
 * Resumes the music.
 */
export const resume: CommandRegistrator = (bot) => {
  bot.command('resume', async ({ message }) => {
    const info = ProtectService.voice(message);

    if (!bot.voice.isConnected) {
      await bot.voice.join(info.voiceChannelID);
    }

    if (bot.voice.isPlaying) {
      return await bot.voice.resume();
    }

    const currentSong = await SongsService.current();

    if (!currentSong) {
      throw new KitkatBotCommandError(Messages.NOT_PLAYING_AUDIO);
    }

    await bot.voice.play(currentSong.url);
  }).help({
    name: 'resume',
    description: 'Resumes the music.',
    group: 'Music',
  });
}
