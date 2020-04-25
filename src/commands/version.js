import dedent from 'dedent';

import { client } from '../utils/discord.js';
import { concat } from '../utils/concat.js';

export const version = {
  description: 'Outputs the Kitkat Bot version information.',
  command: async (message) => {
    message.channel.send(JSON.stringify(process.env, null, ' '));
  }
};
