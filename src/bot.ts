import 'dotenv/config.js';
import { client } from './utils/discord';
import { servers } from './config/servers';
import { periodicallyRefreshStatuses } from './services/server';
import { ProcessCommand } from './services/commands';

client.on('ready', async () => {
    console.log('Kitkat Bot initialized successfully!');

    periodicallyRefreshStatuses(process.env.ANNOUNCEMENTS_CHANNEL_ID, servers);
});

client.on('message', ProcessCommand);

client.on('error', (error) => console.error(error));

client.login(process.env.DISCORD_TOKEN);