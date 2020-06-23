import { outdent } from 'outdent';
import Canvas from 'canvas';
import Discord from 'discord.js';

import { xivapi } from '../services/xivapi';
import { service as XIVService } from '../services/xiv';
import { arrays } from '../utils/arrays';
import { CommandRegistrator } from './types';
import { IPoints } from '../database/xivapi/points';
import { KitkatBotCommandError } from '../types';

export type MapNodes = { [key: string]: IPoints[] };

/**
 * Searches for a given items gathering info.
 */
export const xiv: CommandRegistrator = (bot) => {
  bot.command('xiv <...name>', async ({ message, args }) => {
    const thing = await XIVService.find(args.name);

    if (!thing) {
      throw new KitkatBotCommandError(`No Item / NPC exists with that name. (${args.name})`);
    }

    if (thing.points.length === 0) {
      throw new KitkatBotCommandError(`Sorry, it looks like we don't have that ${thing.type} tracked yet!`);
    }

    const map_nodes: MapNodes = thing.points.reduce((output: MapNodes, point: IPoints) => {
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

      function LabelValue(ctx: Canvas.CanvasRenderingContext2D, label: string, value: string, x: number, y: number, size: number) {
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

      const ICON_CACHE_MAP: {
        [key: string]: Promise<Canvas.Image>;
      } = {};

      await Promise.all(nodes.map(async (node) => {
        if (!ICON_CACHE_MAP[node.icon]) {
          ICON_CACHE_MAP[node.icon] = Canvas.loadImage(xivapi.core.url(node.icon));
        }

        const image = await ICON_CACHE_MAP[node.icon];
        ctx.drawImage(image, node.x * ASPECT_RATIO, node.y * ASPECT_RATIO, image.width * 1.5, image.height * 1.5);
      }));

      LabelValue(ctx, 'Item', thing.name, x, 50 * ASPECT_RATIO + size, size);
      LabelValue(ctx, 'Zone', zone, x, 60 * ASPECT_RATIO + (size * 2), size);
      LabelValue(ctx, 'Region', region, x, 70 * ASPECT_RATIO + (size * 3), size);

      return new Discord.MessageAttachment(canvas.toBuffer(), `${id}-map.png`);
    }));

    await message.channel.send(outdent`
      Here's your gathering information!
    `);

    await arrays.chunk(attachments, 3).reduce(async (promise, attachments) => {
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
