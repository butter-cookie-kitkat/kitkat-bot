import Discord from 'discord.js';

export const client = new Discord.Client();

client.login(process.env.DISCORD_TOKEN);