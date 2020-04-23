import 'dotenv/config.js';
import { client } from './src/utils/discord.js';
import { servers } from './src/config/servers.js';
import { periodicallyRefreshStatuses } from './src/services/server.js';
import { ProcessCommand } from './src/services/commands.js';

client.on('ready', async () => {
    console.log('Kitkat Bot initialized successfully!');

    periodicallyRefreshStatuses(process.env.ANNOUNCEMENTS_CHANNEL_ID, servers);
});

client.on('message', ProcessCommand);

client.on('error', (error) => {
    console.error(error);
});

client.login(process.env.DISCORD_TOKEN);