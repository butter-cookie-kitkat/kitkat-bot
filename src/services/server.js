import dedent from 'dedent';
import { client } from '../utils/discord.js';

import * as Status from '../utils/status.js';

import { ping } from '../utils/ping.js';

export async function periodicallyRefreshStatuses(channelID, servers, delay = 60000) {
    try {
        await Promise.all([
            new Promise((resolve) => setTimeout(resolve, delay)),
            refreshStatuses(channelID, servers)
        ]);
    } catch (error) {
        console.error('Failed to refresh statuses', error);
    }

    periodicallyRefreshStatuses(channelID, servers, delay);
}

export async function refreshStatuses(channelID, servers) {
    console.log('Refreshing statuses...');

    const channel = await client.channels.fetch(channelID);

    const messages = await channel.messages.fetch();

    const existingMessage = messages.find((message) => message.author.id === client.user.id && message.content.includes('`kitkat-bot.servers.refresh`'));

    const responses = await Promise.all(servers.map(async ({ name, address }) => ({
        name,
        address,
        status: await ping(address)
    })));

    const content = dedent`
        **Servers**

        ${responses.map(({ name, address, status }) => dedent`
            > _**${name}**_
            > 
            > Connection Info: _${address}_
            > Status: ${Status.available(status)}
            > Response Time: ${Status.responseTime(status)}
        `)}

        \`kitkat-bot.servers.refresh\`
    `;

    if (existingMessage) {
        await existingMessage.edit(content);
    } else {
        await channel.send(content);
    }

    console.log('Statuses refreshed successfully!');
}