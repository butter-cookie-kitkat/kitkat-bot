import { Discord } from '../discord/discord.js';

export const client = new Discord(
  process.env.DISCORD_TOKEN,
);
