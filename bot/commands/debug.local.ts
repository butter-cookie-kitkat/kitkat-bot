import { CommandRegistrator } from './types';
import { embeds } from '../utils/embeds';

/**
 * Kills the bot!
 */
export const kill: CommandRegistrator = (bot) => {
  bot.command('kill', async ({ message }) => {
    await message.channel.send(embeds.success({
      title: ['Kitkat Bot', 'Signing Off!'],
      description: `さようならせんぱい！`,
    }))

    process.exit(0);
  }).help({
    name: 'kill',
    description: 'Kills the bot.',
    group: 'Debug',
  });
}
