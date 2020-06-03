import outdent from 'outdent';
import { Changelog } from './changelog';
import { client } from '../utils/discord';
import * as Wait from '../utils/wait';

import * as Status from '../utils/status';

import { ping } from '../utils/ping';

const MARKER = '`kitkat-bot.servers.refresh`';

export async function periodicallyRefreshStatuses(channelID, servers) {
  if (!channelID) {
    throw new Error('Channel ID not provided!');
  }

  await Promise.all([
    refreshStatuses(channelID, servers),
    Wait.wait(60000),
  ]);

  periodicallyRefreshStatuses(channelID, servers);
}

export async function refreshStatuses(channelID, servers) {
  console.log('Refreshing statuses...');

  try {
    const responses = await Promise.all(servers.map(async ({ name, address }) => ({
      name,
      address,
      status: await ping(address),
    })));

    const content = outdent`
      **Servers**

      ${responses.length > 0 ? responses.map(({ name, address, status }) => outdent`
        > _**${name}**_
        >
        > Connection Info: _${address}_
        > Status: ${Status.available(status.available)}
        > Response Time: ${Status.responseTime(status)}
      `) : outdent`
        There are no active servers at this time...
      `}

      ${await Changelog.changelog()}

      ${MARKER}
    `;

    const channel = await client.channel(channelID);

    const existingMessage = await channel.findMessage((message) => message.author.id === client.userID && message.content.includes(MARKER));

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
