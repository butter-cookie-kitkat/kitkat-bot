import DiscordJS from 'discord.js'; // eslint-disable-line no-unused-vars
import parser from 'yargs-parser';
import { client } from '../utils/discord';
import { commands } from '../commands/index';
import outdent from 'outdent';
import { argsToYargs } from '../utils/args-to-yargs';
import { FindCommand } from '../utils/commands';

/**
 * @param {DiscordJS.Message} message
 */
export async function ProcessCommand(message) {
  const match = message.content.match(/^\.(.+)/);

  if (!match) return;

  const [, rawCommand] = match;

  const [name] = parser(rawCommand)._;

  console.log(`Processing command... (${rawCommand})`);

  const command = FindCommand(commands, name);

  if (!command) return;

  console.log(`Match found, executing! (${rawCommand})`);

  try {
    await command.exec({ client, message }, parser(rawCommand, argsToYargs(command.args)));
  } catch (error) {
    console.error(error);

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
