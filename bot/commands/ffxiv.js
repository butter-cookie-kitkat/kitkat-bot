import { outdent } from 'outdent';
import Canvas from 'canvas';
import Discord from 'discord.js';

import { DiscordBot } from 'kitkat-bot-core';
import { FFXIV } from '../services/ffxiv';
import { crafters as Crafters } from '../services/crafters';
import { format } from '../utils/formatters';
import { JOBS, REVERSE_JOBS } from '../constants';
import { worker } from '../workers/ffxiv';
import { database } from '../database';
import { Op } from 'sequelize';

/**
 * Searches for a given items gathering info.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function gathering(bot) {
  bot.command('gathering <...name>', async ({ message, args }) => {
    const { gathering } = await database();

    const info = await gathering.findOne({
      where: {
        name: {
          [Op.like]: `%${args.name}%`,
        },
      },
    });

    const map = await Canvas.loadImage(info.map_image);
    const canvas = Canvas.createCanvas(map.width, map.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(map, 0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(info.x, info.y, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
    ctx.fill();

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `${info.id}-map.png`);

    await message.channel.send(outdent`
      Here's your gathering information!

      ${format('Item:').bold.value} ${info.name}
      ${format('Zone:').bold.value} ${info.zone}
      ${format('Region:').bold.value} ${info.region}
      ${format('Place:').bold.value} ${info.place}
    `, attachment);
  }).help({
    name: 'gathering',
    description: 'Searches for the gathering information of a given item.',
    group: 'FFXIV',
    args: {
      name: 'The name of the item to search for.',
    },
  });
}

/**
 * Adds a new crafter.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function crafters(bot) {
  bot.command('crafters', async ({ message }) => {
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
  bot.command('crafter <class> <level> <craftsmanship> <control> <cp>', async ({ message, args }) => {
    await Crafters.replace(message.author.id, REVERSE_JOBS[args.class] || args.class, {
      control: args.control,
      cp: args.cp,
      craftsmanship: args.craftsmanship,
      level: args.level,
    });
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
  bot.command('craft <name>', async ({ message, args }) => {
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

    const solution = await worker.run(recipe, crafter);

    await message.channel.send(outdent`
      Successfully generated a rotation for this item!

      ${format(outdent`
        Item: ${recipe.name}

        ${format('Rotation Info').header.value}

          Success Percentage: ${solution.successPercent}
          HQ Percent (Average): ${solution.averageHQPercent || 'Unknown'}
          HQ Percent (Median): ${solution.medianHQPercent || 'Unknown'}

        ${format('Class Info').header.value}

          Class: ${JOBS[crafter.job]} (${crafter.job})
          Level: ${crafter.level}
          Craftsmanship: ${crafter.craftsmanship}
          Control: ${crafter.control}
          CP: ${crafter.cp}

        ${format('Macro').header.value}

        /macrolock
        ${solution.rotation.map((ability) => outdent`
          /ac ${ability.name} <wait.${ability.buff ? '2' : '3'}>
        `).join('\n')}
        /echo Crafting macro complete! <se.14>
      `).code({ multi: true }).value}
    `);
  }).help({
    name: 'craft',
    description: 'Returns a crafting rotation for the given item.',
    group: 'FFXIV',
    args: {
      name: 'The name of the item to create a rotation for.',
    },
  });
}
