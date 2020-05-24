import 'dotenv/config';
import { client } from './utils/discord';
import { servers } from './config/servers';
import { periodicallyRefreshStatuses } from './services/server';
import { ProcessCommand } from './services/commands';

client.on('ready', async () => {
  console.log('Kitkat Bot initialized successfully!');

  await client.setStatus(`Use .help`);

  if (!process.env.IS_LIVE) {
    await client.setOffline();
  }

  periodicallyRefreshStatuses(process.env.ANNOUNCEMENTS_CHANNEL_ID, servers);
});

client.on('message', ProcessCommand);

client.on('error', (error) => console.error(error));
