import 'dotenv/config.js';
import { client } from './src/utils/discord.js';
import * as Wait from './src/utils/wait.js';
import { servers } from './src/config/servers.js';
import { refreshStatuses } from './src/services/server.js';
import { ProcessCommand } from './src/services/commands.js';

client.on('ready', async () => {
    console.log('Kitkat Bot initialized successfully!');

    while (true) {
        await Promise.all([
            refreshStatuses(process.env.ANNOUNCEMENTS_CHANNEL_ID, servers),
            Wait.wait(60000)
        ]);
    }
});

client.on('message', ProcessCommand);

client.login(process.env.DISCORD_TOKEN);