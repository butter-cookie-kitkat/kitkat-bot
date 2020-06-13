import { outdent } from 'outdent';

import { DiscordBot } from 'kitkat-bot-core';
import { FFXIV } from '../services/ffxiv';
import { crafters as Crafters } from '../services/crafters';
import { format } from '../utils/formatters';
import { reactor } from '../utils/reactor';
import { JOBS, REVERSE_JOBS } from '../constants';

/**
 * Adds a new crafter.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function crafters(bot) {
  bot.command([
    'crafters',
  ], async ({ message, args }) => {
    const crafters = await Crafters.getAll(message.author.id);

    await message.channel.send(outdent`
      Here's a list of your crafters!

      ${format(crafters.map((crafter) => outdent`
        ${format(`${JOBS[crafter.job]} (${crafter.job})`).header.value}

          Level: ${crafter.level}
          Craftsmanship: ${crafter.craftsmanship}
          Control: ${crafter.control}
          CP: ${crafter.cp}
      `).join('\n')).code({ multi: true }).value}
    `);
  }).help({
    name: 'crafter',
    description: 'Updates the crafting settings for a given class.',
    group: 'FFXIV',
    args: {
      class: 'The name of the class. (can be either the abbreviation or the full name)',
      level: 'The level of the player.',
      craftsmanship: 'The craftsmanship attribute of the player.',
      control: 'The control attribute of the player.',
      cp: 'The maximum cp of the player.',
    },
  });
}

/**
 * Replaces a crafter.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function crafter(bot) {
  bot.command([
    'crafter <class> <level> <craftsmanship> <control> <cp>',
  ], async ({ message, args }) => {
    await Promise.all([
      reactor.success(message),
      Crafters.replace(message.author.id, REVERSE_JOBS[args.class] || args.class, {
        control: args.control,
        cp: args.cp,
        craftsmanship: args.craftsmanship,
        level: args.level,
      }),
    ]);
  }).help({
    name: 'crafter',
    description: 'Updates the crafting settings for a given class.',
    group: 'FFXIV',
    args: {
      class: 'The name of the class. (can be either the abbreviation or the full name)',
      level: 'The level of the player.',
      craftsmanship: 'The craftsmanship attribute of the player.',
      control: 'The control attribute of the player.',
      cp: 'The maximum cp of the player.',
    },
  });
}

/**
 * Adds a song to the queue.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function craft(bot) {
  bot.command([
    'craft <name>',
    // TODO: Implement storage for crafting information.
    // 'craft <name>',
  ], async ({ message, args }) => {
    reactor.loading(message, Promise.resolve().then(async () => {
      const recipe = await FFXIV.getRecipe(args.name);

      if (!recipe) {
        return await message.channel.send(outdent`
          Unable to locate an item named "${args.name}".
        `);
      }

      const crafter = await Crafters.get(message.author.id, recipe.job);

      if (!crafter) {
        return await message.channel.send(outdent`
          Please setup a ${JOBS[recipe.job]} (${recipe.job}) crafter using the ${format('.crafter').code().value} command in order to return a macro for this item.
        `);
      }

      const rotation = await FFXIV.solve(recipe, crafter.level, crafter.craftsmanship, crafter.control, crafter.cp);

      await message.channel.send(outdent`
        Successfully generated a rotation for this item!

        ${format(outdent`
          Item: ${recipe.name}

          ${format('Class Info').header.value}

            Class: ${JOBS[crafter.job]} (${crafter.job})
            Level: ${crafter.level}
            Craftsmanship: ${crafter.craftsmanship}
            Control: ${crafter.control}
            CP: ${crafter.cp}

          ${format('Macro').header.value}

          ${rotation.map((ability) => outdent`
            /ac ${ability.name} <wait.${ability.buff ? '2' : '3'}>
          `).join('\n')}
        `).code({ multi: true }).value}
      `);
    }));
  }).help({
    name: 'craft',
    description: 'Returns a crafting rotation for the given item.',
    group: 'FFXIV',
    args: {
      name: 'The name of the item to create a rotation for.',
    },
  });
}
