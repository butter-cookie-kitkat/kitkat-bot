import DiscordJS from 'discord.js'; // eslint-disable-line no-unused-vars
import { client } from '../utils/discord.js';
import { commands } from '../commands/index.js';
import outdent from 'outdent';

export function FindCommand(name) {
  const command = Object.values(commands).find((command) => command.name === name || command.aliases.includes(name));

  if (command) return command.command;
  else return null;
}

/**
 * @param {DiscordJS.Message} message
 */
export async function ProcessCommand(message) {
  const match = message.content.match(/^\.(.+)/);

  if (!match) return;

  const [, rawCommand] = match;

  const [name, ...args] = rawCommand.split(' ');

  console.log(`Processing command... (${rawCommand})`);

  const command = FindCommand(name);

  if (!command) return;

  console.log(`Match found, executing! (${rawCommand})`);

  try {
    await command(message, ...args);
  } catch (error) {
    if (process.env.NOTIFICATIONS_CHANNEL_ID) {
      const channel = await client.channel(process.env.NOTIFICATIONS_CHANNEL_ID);

      await channel.send(outdent`
        We encountered an error while processing the following commmand.

        **Author**: ${message.author.username}
        **Command**: \`${message.content}\`
        **Message**: \`${error.message}\`

        **~-~-~-~ Stack Trace ~-~-~-~**

        \`\`\`
        ${error.stack}
        \`\`\`
      `);
    }

    await message.channel.send(error.userMessage || outdent`
      Whoa, looks like something went wrong.
      Don't worry though we're looking into it!
    `);
  }
}
