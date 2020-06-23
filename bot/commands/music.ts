import { service as EffectsService } from '../services/effects';
import { intl } from '../services/intl';

import { service as SongsService } from '../services/songs';
import { service as YouTubeService } from '../services/youtube';
import { concat } from '../utils/concat';
import { duration } from '../utils/duration';
import { service as ProtectService } from '../services/protect';
import { CommandRegistrator } from './types';
import { KitkatBotCommandError } from '../types';
import { embeds } from '../utils/embeds';
import { format } from '../utils/formatters';

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
      throw new KitkatBotCommandError(intl('INVALID_YOUTUBE_URL'));
    }

    /**
     * Play this as a Playlist if the following is true:
     *  - The URL isn't a video url.
     *  - The Playlist Argument was passed and url is a Playlist url.
     */
    if (urlInfo.video_id && (!args.playlist || !urlInfo.playlist_id)) {
      const song = await YouTubeService.getVideoByID(urlInfo.video_id);

      if (!song) {
        throw new KitkatBotCommandError(intl('VIDEO_NOT_FOUND'));
      }

      if (args.now) {
        await SongsService.unshift(message.channel.id, song);
      } else {
        await SongsService.add(message.channel.id, song);
      }

      if (bot.voice.isPlaying && !args.now) {
        await message.channel.send(embeds.success({
          title: ['Music', 'Song Added'],
          description: `\`${song.title}\` has been added to the queue!`,
        }));
      }
    } else if (urlInfo.playlist_id) {
      const playlist = await YouTubeService.getPlaylistByID(urlInfo.playlist_id);

      if (!playlist) {
        throw new KitkatBotCommandError(intl('PLAYLIST_NOT_FOUND'));
      }

      await SongsService.add(message.channel.id, ...playlist.songs);

      if (args.now) {
        throw new KitkatBotCommandError(intl('STOP_TROLLING'));
      }

      await message.channel.send(embeds.success({
        title: ['Music', 'Playlist Added'],
        description: `The \`${playlist.name}\` Playlist has been added to the queue! (${playlist.songs.length} songs)`,
      }));
    }

    if (!bot.voice.isPlaying || args.now) {
      const song = await SongsService.current();

      if (!song) {
        throw new KitkatBotCommandError(intl('CURRENT_SONG_NOT_FOUND'));
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
    ProtectService.guild(message);

    const {
      songs,
      count,
    } = await SongsService.list({ limit: 11 });

    if (songs.length === 0) {
      return message.channel.send(embeds.success({
        title: ['Music', 'Queue (Empty)'],
        description: format('There are currently no songs in the queue.').italics.toString(),
      }));
    }

    const [current, ...queue] = songs;

    return message.channel.send(embeds.success({
      title: [
        'Music',
        concat.join(
          'Queue',
          songs.length !== count && `(${songs.length - 1}/${count - 1})`,
        ),
      ],
      fields: [{
        name: 'Current Song',
        value: `[${current.title}](${current.url})`,
        inline: true,
      }, {
        name: 'Time Remaining',
        value: duration.humanize(current.duration - (bot.voice.elapsed || 0)),
        inline: true,
      }, {
        name: 'Queue',
        value: queue.length ? queue.map((song, index) => `${format(index + 1).bold}) [${song.title}](${song.url})`).join('\n') : '_Empty_',
        inline: false,
      }],
    }));
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
      throw new KitkatBotCommandError(intl('NOT_PLAYING_AUDIO'));
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
    const names = Object.keys(EffectsService.public);

    return message.channel.send(embeds.success({
      title: ['Effects', `List (${names.length})`],
      fields: [{
        name: 'Name',
        value: names.join('\r\n'),
        inline: true,
      }, {
        name: 'Command',
        value: names.map((name) => `.effect ${name}`).join('\r\n'),
        inline: true,
      }],
    }));
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
      throw new KitkatBotCommandError(intl('BAD_EFFECT_NAME'));
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
      throw new KitkatBotCommandError(intl('BOT_NOT_IN_VOICE_CHANNEL'));
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
      throw new KitkatBotCommandError(intl('NOT_PLAYING_AUDIO'));
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
      throw new KitkatBotCommandError(intl('NOT_PLAYING_AUDIO'));
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
      throw new KitkatBotCommandError(intl('NOT_PLAYING_AUDIO'));
    }

    await bot.voice.play(currentSong.url);
  }).help({
    name: 'resume',
    description: 'Resumes the music.',
    group: 'Music',
  });
}
