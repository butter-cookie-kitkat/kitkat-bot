import dedent from 'dedent';
import { client } from '../utils/discord.js';
import * as Wait from '../utils/wait.js';

import * as Status from '../utils/status.js';

import { ping } from '../utils/ping.js';

export async function periodicallyRefreshStatuses(channelID, servers) {
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