import { Client } from 'discord.js';

export const client = new Client();

client.login(process.env.DISCORD_TOKEN);