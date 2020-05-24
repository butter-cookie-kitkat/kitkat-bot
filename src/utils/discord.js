import { Discord } from '../discord/discord';

export const client = new Discord(
  process.env.DISCORD_TOKEN,
);
