import dedent from 'dedent';
import { client } from '../utils/discord.js';
import * as Wait from '../utils/wait.js';

import * as Status from '../utils/status.js';

import { ping } from '../utils/ping.js';

export async function periodicallyRefreshStatuses(channelID, servers) {
  if (!channelID) {
    throw new Error('Channel ID not provided!');
  }

  while (true) {
    await Promise.all([
      refreshStatuses(channelID, servers),
      Wait.wait(60000)
    ]);
  }
}

export async function refreshStatuses(channelID, servers) {
  console.log('Refreshing statuses...');

  try {
    const responses = await Promise.all(servers.map(async ({ name, address }) => ({
      name,
      address,
      status: await ping(address)
    })));

    const content = dedent`
      **Servers**

      ${responses.length > 0 ? responses.map(({ name, address, status }) => dedent`
        > _**${name}**_
        >
        > Connection Info: _${address}_
        > Status: ${Status.available(status)}
        > Response Time: ${Status.responseTime(status)}
      `) : dedent`
        There are no active servers at this time...
      `}

      \`kitkat-bot.servers.refresh\`
    `;

    const channel = await client.channel(channelID);

    const existingMessage = await channel.findMessage((message) => message.author.id === client.userID && message.content.includes('`kitkat-bot.servers.refresh`'));

    if (existingMessage) {
      await existingMessage.edit(content);
    } else {
      await channel.send(content);
    }

    console.log('Statuses refreshed successfully!');
  } catch (error) {
    console.error('Failed to refresh statuses', error);
  }
}
