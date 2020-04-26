import 'dotenv/config.mjs';
import { client } from './utils/discord.mjs';
import { servers } from './config/servers.mjs';
import { periodicallyRefreshStatuses } from './services/server.mjs';
import { ProcessCommand } from './services/commands.mjs';

client.on('ready', async () => {
  console.log('Kitkat Bot initialized successfully!');

  await client.setStatus(`Use .help.`);

  if (!process.env.IS_LIVE) {
    await client.setOffline();
  }

  periodicallyRefreshStatuses(process.env.ANNOUNCEMENTS_CHANNEL_ID, servers);
});

client.on('message', ProcessCommand);

client.on('error', (error) => console.error(error));
