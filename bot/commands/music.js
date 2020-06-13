import { outdent } from 'outdent';

import { DiscordBot } from 'kitkat-bot-core';

import { Effects } from '../services/effects';
import { Messages } from '../services/messages';

import { reactor } from '../utils/reactor';
import { Songs } from '../services/songs';
import { YouTube } from '../services/youtube';
import { Concat } from '../utils/concat';
import { Duration } from '../utils/duration';

/**
 * Adds a song to the queue.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function play(bot) {
  bot.command('play <url>', async ({ message, args }) => {
    if (!message.member.voice.channelID) {
      return await message.reply(Messages.NOT_IN_VOICE_CHANNEL);
    }

    await bot.voice.join(message.member.voice.channelID);

    if (args.playlist) {
      const playlist = await YouTube.getPlaylist(args.url);
      await Songs.add(message.channel.id, ...playlist.songs);

      if (args.now) {
        return await message.reply(Messages.STOP_TROLLING);
      }

      await message.channel.send(`The \`${playlist.name}\` Playlist has been added to the queue! (${playlist.songs.length} songs)`);
    } else {
      const song = await YouTube.getVideo(args.url);
      if (args.now) {
        await Songs.unshift(message.channel.id, song);
      } else {
        await Songs.add(message.channel.id, song);
      }

      if (bot.voice.isPlaying && !args.now) {
        await message.react('👍');

        await message.channel.send(outdent`
          \`${song.title}\` has been added to the queue!
        `);
      }
    }

    if (!bot.voice.isPlaying || args.now) {
      const song = await Songs.current();

      await reactor.loading(
        message,
        bot.voice.play(song.url),
      );
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
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function queue(bot) {
  bot.command('queue', async ({ message }) => {
    const {
      songs,
      hasMore,
    } = await Songs.list({ limit: 10 });
    if (songs.length > 0) {
      console.log(songs[0].duration - bot.voice.elapsed);
      await message.channel.send(outdent`
        Here's a list of the current songs in the queue.

        ${songs.map((song, index) => Concat.join(`${index + 1}) \`${song.title}\``, index === 0 && `<-- Current Track - ${Duration.humanize(song.duration - bot.voice.elapsed)}`)).join('\n')}
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
 * Adds a song to the queue.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function skip(bot) {
  bot.command('skip', async ({ message }) => {
    if (!bot.voice.isPlaying) {
      return await message.reply(Messages.NOT_PLAYING_AUDIO);
    }

    await message.react('👍');
    bot.voice.stop();
  }).help({
    name: 'skip',
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
 * Lists out the available commands.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function effects(bot) {
  bot.command('effects', async ({ message }) => {
    await message.channel.send(outdent`
      Here's a list of all the available sound effects.

      ${Object.keys(Effects.public).map((name) => `- ${name}`).join('\r\n')}
    `);
  }).help({
    name: 'effects',
    description: 'Lists all the available effects.',
    group: 'Music',
  });
}

/**
 * Plays a sound effect.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function effect(bot) {
  bot.command('effect <name>', async ({ message, args }) => {
    const effect = Effects.effect(args.name);

    if (!effect) {
      return await message.reply(Messages.BAD_EFFECT_NAME);
    }

    if (!message.member.voice.channelID) {
      return await message.reply(Messages.NOT_IN_VOICE_CHANNEL);
    }

    if (!bot.voice.isConnected) {
      await bot.voice.join(message.member.voice.channelID);
    }

    await Promise.all([
      message.react('👍'),
      bot.voice.play(effect.path),
    ]);
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
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function join(bot) {
  bot.command('join', async ({ message }) => {
    if (!message.member.voice.channelID) {
      return await message.reply(Messages.NOT_IN_VOICE_CHANNEL);
    }

    await Promise.all([
      message.react('👍'),
      bot.voice.join(message.member.voice.channelID),
    ]);
  }).help({
    name: 'join',
    description: 'Joins the Voice Chat.',
    group: 'Music',
  });
}

/**
 * Leaves the users voice channel.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function leave(bot) {
  bot.command('leave', async ({ message }) => {
    if (!bot.voice.isConnected) {
      return await message.reply(Messages.BOT_NOT_IN_VOICE_CHANNEL);
    }

    await Promise.all([
      message.react('👍'),
      bot.voice.leave(),
    ]);
  }).help({
    name: 'leave',
    description: 'Leaves the Voice Chat.',
    group: 'Music',
  });
}

/**
 * Stops playing audio.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function stop(bot) {
  bot.command('stop', async ({ message }) => {
    if (!bot.voice.isPlaying) {
      return await message.reply(Messages.NOT_PLAYING_AUDIO);
    }

    await Promise.all([
      message.react('👍'),
      Songs.clear(),
    ]);

    await bot.voice.stop();
  }).help({
    name: 'stop',
    description: 'Stops all audio.',
    group: 'Music',
  });
}

/**
 * Pauses the music.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function pause(bot) {
  bot.command('pause', async ({ message }) => {
    if (!bot.voice.isPlaying) {
      return await message.reply(Messages.NOT_PLAYING_AUDIO);
    }

    await Promise.all([
      message.react('👍'),
      bot.voice.pause(),
    ]);
  }).help({
    name: 'pause',
    description: 'Pauses the music.',
    group: 'Music',
  });
}

/**
 * Resumes the music.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function resume(bot) {
  bot.command('resume', async ({ message }) => {
    if (bot.voice.isPlaying) {
      return await Promise.all([
        message.react('👍'),
        bot.voice.resume(),
      ]);
    }

    const currentSong = await Songs.current();

    if (!currentSong) {
      return await message.reply(Messages.NOT_PLAYING_AUDIO);
    }

    await bot.voice.join(message.member.voice.channelID);
    await bot.voice.play(currentSong.url);
  }).help({
    name: 'resume',
    description: 'Resumes the music.',
    group: 'Music',
  });
}
