import { CommandRegistrator } from './types';

/**
 * Kills the bot!
 */
export const kill: CommandRegistrator = (bot) => {
  bot.command('kill', async ({ message }) => {
    await message.reply(`Goodbye...`);

    process.exit();
  }).help({
    name: 'kill',
    description: 'Kills the bot.',
    group: 'Debug',
  });
}
