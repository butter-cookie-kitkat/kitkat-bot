import * as Concat from '../utils/concat.js';
import { Random } from '../utils/random.js';

export const roll = {
  name: 'roll',
  description: 'Roll a dice with the given max value.',
  args: {
    max: 'The maximum dice value.'
  },
  command: async ({ message }, max) => {
    await message.reply(`You rolled a ${Random.integer(1, max)}.`);
  }
};

export const rolld4 = {
  name: 'rolld4',
  aliases: ['roll4'],
  description: 'Roll a d4.',
  command: async (info) => {
    await roll.command(info, 4);
  }
};

export const rolld6 = {
  name: 'rolld6',
  aliases: ['roll6'],
  description: 'Roll a d6.',
  command: async (info) => {
    await roll.command(info, 6);
  }
};

export const rolld8 = {
  name: 'rolld8',
  aliases: ['roll8'],
  description: 'Roll a d8.',
  command: async (info) => {
    await roll.command(info, 8);
  }
};

export const rolld12 = {
  name: 'rolld12',
  aliases: ['roll12'],
  description: 'Roll a d12.',
  command: async (info) => {
    await roll.command(info, 12);
  }
};

export const rolld20 = {
  name: 'rolld20',
  aliases: ['roll20'],
  description: 'Roll a d20.',
  command: async ({ message }) => {
    const result = Random.integer(1, 20);

    await message.reply(Concat.concat(
      `You rolled a ${result}.`,
      result === 20 ? 'Critical Hit!' : null
    ));
  }
};

export const rolld100 = {
  name: 'rolld100',
  aliases: ['roll100'],
  description: 'Roll a d100.',
  command: async (info) => {
    await roll.command(info, 100);
  }
};

export default [
  roll,
  rolld4,
  rolld6,
  rolld8,
  rolld12,
  rolld20,
  rolld100
].map((command) => ({
  ...command,
  group: 'Roll'
}));
