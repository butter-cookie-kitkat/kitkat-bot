import { outdent } from 'outdent';
import Canvas from 'canvas';
import Discord from 'discord.js';

import { DiscordBot } from 'kitkat-bot-core';
import { crafters as Crafters } from '../services/crafters';
import { format } from '../utils/formatters';
import { JOBS, REVERSE_JOBS } from '../constants';
import { worker as crafting_solver_worker } from '../workers/crafting-solver';
import { database } from '../database';
import { Op } from 'sequelize';
import { xivapi } from '../services/xivapi';
import { Arrays } from '../utils/arrays';
import { FFXIV } from '../services/ffxiv';

/**
 * Searches for a given items gathering info.
 *
 * @param {DiscordBot} bot - the discord bot.
 */
export function xiv(bot) {
  bot.command('xiv <...name>', async ({ message, args }) => {
    const { xivapi_things, xivapi_points } = await database();

    const thing = await xivapi_things.findOne({
      where: {
        name: {
          [Op.like]: `%${args.name}%`,
        },
      },
      include: [{
        all: true,
        model: xivapi_points,
      }],
    });

    if (!thing) {
      return message.channel.send(outdent`
        No Item / NPC exists with that name. (${args.name})
      `);
    }

    if (thing.xivapi_points.length === 0) {
      return message.channel.send(outdent`
        Sorry, it looks like we don't have that ${thing.type} tracked yet!
      `);
    }

    const map_nodes = thing.xivapi_points.reduce((output, point) => {
      output[point.map_id] = output[point.map_id] || [];
      output[point.map_id].push(point);

      return output;
    }, {});

    const map_data = await xivapi.maps.getAll(Object.keys(map_nodes));

    const attachments = await Promise.all(map_data.map(async ({ id, map_image, zone, region }) => {
      const ASPECT_RATIO = 0.5;

      const nodes = map_nodes[id];

      const image = await Canvas.loadImage(map_image);
      const canvas = Canvas.createCanvas(image.width * ASPECT_RATIO, image.height * ASPECT_RATIO);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      /**
       * @param ctx
       * @param label
       * @param value
       * @param x
       * @param y
       * @param size
       */
      function LabelValue(ctx, label, value, x, y, size) {
        ctx.fillStyle = 'black';
        ctx.font = `bold ${size}px Arial`;
        ctx.textAlign = 'right';
        ctx.fillText(`${label}:`, x, y);
        ctx.font = `${size}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillText(`${value}`, x + size / 2, y);
      }

      const size = 50 * ASPECT_RATIO;
      const x = 230 * ASPECT_RATIO;

      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x * ASPECT_RATIO, node.y * ASPECT_RATIO, 30 * ASPECT_RATIO, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
        ctx.fill();
      }

      LabelValue(ctx, 'Item', thing.name, x, 50 * ASPECT_RATIO + size, size);
      LabelValue(ctx, 'Zone', zone, x, 60 * ASPECT_RATIO + (size * 2), size);
      LabelValue(ctx, 'Region', region, x, 70 * ASPECT_RATIO + (size * 3), size);

      return new Discord.MessageAttachment(canvas.toBuffer(), `${id}-map.png`);
    }));

    await message.channel.send(outdent`
      Here's your gathering information!
    `);

    await Arrays.chunk(attachments, 3).reduce(async (promise, attachments) => {
      await promise;

      await message.channel.send({
        files: attachments,
      });
    }, Promise.resolve());
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

    const solution = await crafting_solver_worker.run(recipe, crafter);

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
