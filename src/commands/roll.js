import parser from 'yargs-parser';
import * as Concat from '../utils/concat';
import { Random } from '../utils/random';

export const roll = {
  name: 'roll',
  description: 'Roll a dice with the given max value.',
  args: {
    max: 'The maximum dice value.',
  },
  exec: async ({ message }, args) => {
    const [, max] = args._;

    await message.reply(`You rolled a ${Random.integer(1, max)}.`);
  },
};

export const rolld4 = {
  name: 'rolld4',
  aliases: ['roll4'],
  description: 'Roll a d4.',
  exec: async (info) => {
    await roll.exec(info, parser(`roll ${4}`));
  },
};

export const rolld6 = {
  name: 'rolld6',
  aliases: ['roll6'],
  description: 'Roll a d6.',
  exec: async (info) => {
    await roll.exec(info, parser(`roll ${6}`));
  },
};

export const rolld8 = {
  name: 'rolld8',
  aliases: ['roll8'],
  description: 'Roll a d8.',
  exec: async (info) => {
    await roll.exec(info, parser(`roll ${8}`));
  },
};

export const rolld12 = {
  name: 'rolld12',
  aliases: ['roll12'],
  description: 'Roll a d12.',
  exec: async (info) => {
    await roll.exec(info, parser(`roll ${12}`));
  },
};

export const rolld20 = {
  name: 'rolld20',
  aliases: ['roll20'],
  description: 'Roll a d20.',
  exec: async ({ message }) => {
    const result = Random.integer(1, 20);

    await message.reply(Concat.concat(
      `You rolled a ${result}.`,
      result === 20 ? 'Critical Hit!' : null,
    ));
  },
};

export const rolld100 = {
  name: 'rolld100',
  aliases: ['roll100'],
  description: 'Roll a d100.',
  exec: async (info) => {
    await roll.exec(info, parser(`roll ${100}`));
  },
};

export default [
  roll,
  rolld4,
  rolld6,
  rolld8,
  rolld12,
  rolld20,
  rolld100,
].map((exec) => ({
  ...exec,
  group: 'Roll',
}));
