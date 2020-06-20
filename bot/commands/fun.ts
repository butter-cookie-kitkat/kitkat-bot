import { concat } from '../utils/concat';
import { CommandRegistrator } from './types';
import { Embeds } from '../utils/embeds';
import { format } from '../utils/formatters';
import { random } from '../utils/random';

/**
 * Rolls a number between 1 and n.
 */
export const roll: CommandRegistrator = (bot) => {
  bot.command([
    'roll <max>',
    'roll',
  ], async ({ message, args }) => {
    const number = random.integer(1, args.max);

    await message.reply(Embeds.success({
      title: `You've rolled the dice...`,
      description: concat.join(
        `And landed a ${number}.`,
        args.max === 20 && number === args.max && format('Critical Hit!').bold.toString(),
      ),
    }));
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
