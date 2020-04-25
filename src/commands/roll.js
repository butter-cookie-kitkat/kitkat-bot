import * as Random from '../utils/random.js';

export const roll = {
  description: 'Roll a dice with the given max value.',
  args: {
    max: 'The maximum dice value.'
  },
  command: async (message, max) => {
    await message.reply(`You rolled a ${Random.integer(1, max)}.`);
  }
};

export const rolld4 = {
  aliases: ['roll4'],
  description: 'Roll a d4.',
  command: async (message) => {
    await roll.command(message, 4);
  }
};

export const rolld6 = {
  aliases: ['roll6'],
  description: 'Roll a d6.',
  command: async (message) => {
    await roll.command(message, 6);
  }
};

export const rolld8 = {
  aliases: ['roll8'],
  description: 'Roll a d8.',
  command: async (message) => {
    await roll.command(message, 8);
  }
};

export const rolld12 = {
  aliases: ['roll12'],
  description: 'Roll a d12.',
  command: async (message) => {
    await roll.command(message, 12);
  }
};

export const rolld20 = {
  aliases: ['roll20'],
  description: 'Roll a d20.',
  command: async (message) => {
    const result = Random.integer(1, 20);

    await message.reply(Concat.concat(
      `You rolled a ${result}.`,
      result === 20 ? 'Critical Hit!' : null
    ));
  }
};

export const rolld100 = {
  aliases: ['roll100'],
  description: 'Roll a d100.',
  command: async (message) => {
    await roll.command(message, 100);
  }
};
