import 'dotenv/config.js';
import { client } from './utils/discord.js';
import { servers } from './config/servers.js';
import { periodicallyRefreshStatuses } from './services/server.js';
import { ProcessCommand } from './services/commands.js';

client.on('ready', async () => {
    console.log('Kitkat Bot initialized successfully!');

    if (client.user) {
        client.user.setActivity(`Use .help.`, {
            type: 'PLAYING'
        }); 
    }

    periodicallyRefreshStatuses(process.env.ANNOUNCEMENTS_CHANNEL_ID, servers);
});

client.on('message', ProcessCommand);

client.on('error', (error) => console.error(error));

client.login(process.env.DISCORD_TOKEN);