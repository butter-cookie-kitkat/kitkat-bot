import { Discord } from '../discord/discord.mjs';

export const client = new Discord(
  process.env.DISCORD_TOKEN
);
