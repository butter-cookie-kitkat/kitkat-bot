import { DiscordBot } from 'kitkat-bot-core';
import { chance } from '../utils/chance';
import { Concat } from '../utils/concat';

/**
 * Adds a song to the queue.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function roll(bot) {
  bot.command([
    'roll <max>',
    'roll',
  ], async ({ message, args }) => {
    const number = chance.integer({
      min: 1,
      max: args.max,
    });

    await message.reply(Concat.join(
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
