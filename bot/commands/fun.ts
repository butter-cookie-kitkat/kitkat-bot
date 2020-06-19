import { chance } from '../utils/chance';
import { concat } from '../utils/concat';
import { CommandRegistrator } from './types';

/**
 * Adds a song to the queue.
 */
export const roll: CommandRegistrator = (bot) => {
  bot.command([
    'roll <max>',
    'roll',
  ], async ({ message, args }) => {
    const number = chance.integer({
      min: 1,
      max: args.max,
    });

    await message.reply(concat.join(
      `You rolled a ${number}.`,
      args.max === 20 && number === args.max && 'Critical Hit!',
    ));
  }).help({
    name: 'roll',
    description: 'Roll a dice between 1 and the max value.',
    group: 'Fun',
    args: {
      max: {
        description: 'The max value to roll to.',
        default: 20,
        type: 'number',
      },
    },
  })
}
