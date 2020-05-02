import outdent from 'outdent';

import { concat } from '../utils/concat.js';
import * as Duration from '../utils/duration.js';

export const join = {
  name: 'join',
  description: 'Joins the Voice Chat.',
  command: async ({ client, message }) => {
    if (message.member.voice.channel) {
      await client.music.join(message.member.voice.channelID);
    } else {
      message.channel.send('You need to join a voice channel first!');
    }
  }
};

export const leave = {
  name: 'leave',
  description: 'Leaves the Voice Chat.',
  command: async ({ client }) => {
    await client.music.leave();
  }
};

export const skip = {
  name: 'skip',
  description: 'Skips the current songs.',
  command: async ({ client }) => {
    await client.music.skip();
  }
};

export const effect = {
  name: 'effect',
  description: 'Plays a sound effect with the given name.',
  args: {
    name: 'The sound effect name'
  },
  command: async ({ client, message }, name) => {
    await client.music.effect(message.member.voice.channel.id, name);
  }
};

export const effects = {
  name: 'effects',
  description: 'Outputs a list of the available sound effects.',
  command: async ({ client, message }) => {
    await message.channel.send(outdent`
      Here's a list of all the available sound effects.

      ${Object.keys(client.music.effects).map((name) => `- ${name}`).join('\r\n')}
    `);
  }
};

export const play = {
  name: 'play',
  description: 'Adds a song to the queue.',
  args: {
    url: 'The song url',
    now: 'Whether the song should be played immediately.'
  },
  command: async ({ client, message }, url, now) => {
    if (!client.music.isInVoiceChannel) {
      await join.command(message);
    }

    if (now) {
      const song = await client.music.unshift(url);

      await client.music.play(song);

      await message.channel.send(`Now playing \`${song.title}\`!`);
    } else {
      const song = await client.music.push(url);

      await message.channel.send(`\`${song.title}\` has been added to the queue!`);
    }
  }
};

export const resume = {
  name: 'resume',
  description: 'Resumes the current song.',
  command: async ({ client }) => {
    await client.music.resume();
  }
};

export const pause = {
  name: 'pause',
  description: 'Pauses the current song.',
  command: async ({ client }) => {
    await client.music.pause();
  }
};

function formatSong({ isCurrentSong, number, title, timeRemaining }) {
  return concat(
    `${number}) \`${title}\``,
    isCurrentSong && `<-- Current Track - ${Duration.humanize(timeRemaining)} remaining`
  );
}

export const queue = {
  name: 'queue',
  description: 'Lists all of the songs currently in the queue.',
  command: async ({ client, message }) => {
    if (client.music.songs.length > 0) {
      message.channel.send(outdent`
        Here's a list of the current songs in the queue.

        ${client.music.songs.map((song, index) => formatSong({ number: index + 1, ...song })).join('\n')}
      `);
    } else {
      message.channel.send('There are currently no songs in the queue.');
    }
  }
};

export default [
  join,
  leave,
  skip,
  effect,
  effects,
  play,
  resume,
  pause,
  queue
].map((command) => ({
  ...command,
  group: 'Music'
}));
