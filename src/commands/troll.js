import { ToggleTroll } from '../services/troll.js';

export const troll = {
  name: 'troll',
  aliases: ['roll100'],
  description: 'Roll a d100.',
  command: async ({ client }) => ToggleTroll(client)
};

export default [
  troll
].map((command) => ({
  ...command,
  hidden: true
}));
