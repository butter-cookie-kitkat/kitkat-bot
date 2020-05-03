import { ToggleTroll } from '../services/troll.js';

export const troll = {
  name: 'troll',
  aliases: ['roll100'],
  description: 'Roll a d100.',
  command: async ({ client, message }) => {
    const active = ToggleTroll(client);

    message.author.send(`Troll Mode is now ${active ? 'Engaged!' : 'Disengaged...'}`);
  },
};

export default [
  troll,
].map((command) => ({
  ...command,
  hidden: true,
}));
