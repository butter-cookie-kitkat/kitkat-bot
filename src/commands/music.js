import dedent from 'dedent';

import { client } from '../utils/discord.js';
import { concat } from '../utils/concat.js';

export const join = {
  description: 'Joins the Voice Chat.',
  command: async (message) => {
    if (message.member.voice.channel) {
      await client.music.join(message.member.voice.channelID);
    } else {
      message.channel.send('You need to join a voice channel first!');
    }
  }
};

export const leave = {
  description: 'Leaves the Voice Chat.',
  command: async () => {
    await client.music.leave();
  }
};

export const skip = {
  description: 'Skips the current songs.',
  command: async () => {
    await client.music.skip();
  }
};

export const play = {
  description: 'Adds a song to the queue.',
  args: {
    url: 'The song url',
    now: 'Whether the song should be played immediately.'
  },
  command: async (message, url, now) => {
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

function formatSong({ number, title }) {
  const isCurrentTrack = number === 1;

  return concat(
    `${number}) \`${title}\``,
    isCurrentTrack && '<-- Current Track'
  );
}

export const queue = {
  description: 'Lists all of the songs currently in the queue.',
  command: async (message) => {
    message.channel.send(dedent`
      Here's a list of the current songs in the queue.

      ${client.music.songs.map((song, index) => formatSong({ number: index + 1, ...song })).join('\n')}
    `);
  }
};
