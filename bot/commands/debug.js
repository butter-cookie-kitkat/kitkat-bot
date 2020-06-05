import { DiscordBot } from '../core';

/**
 * Adds a song to the queue.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function kill(bot) {
  bot.command('kill', async ({ message }) => {
    await message.reply(`Goodbye...`);

    process.exit();
  }).help({
    name: 'kill',
    description: 'Kills the bot.',
    group: 'Debug',
  })
}
