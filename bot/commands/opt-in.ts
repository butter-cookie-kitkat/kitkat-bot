import { intl } from '../services/intl';

import { service as ProtectService } from '../services/protect';
import { CommandRegistrator } from './types';
import { KitkatBotCommandError } from '../types';
import { embeds } from '../utils/embeds';
import { format } from '../utils/formatters';

const RANKS: string[] = [
  'Mute Club',
  'FFXIV',
  'Halo',
];

export const ranks: CommandRegistrator = (bot) => {
  bot.command('ranks', async ({ message }) => {
    return message.channel.send(embeds.success({
      title: ['Ranks'],
      description: RANKS.join('\r\n'),
    }));
  });
};

/**
 * Adds a song to the queue.
 */
export const rank: CommandRegistrator = (bot) => {
  bot.command('rank <...rank>', async ({ message, args }) => {
    if (!RANKS.includes(args.rank)) {
      throw new KitkatBotCommandError(intl('INVALID_OPT_ROLE'));
    }

    const roleID = message.guild?.roles.cache.find((role) => role.name === args.rank)?.id;

    if (!roleID) {
      throw new KitkatBotCommandError(intl('INVALID_OPT_ROLE'));
    }

    const { guildMember: member } = await ProtectService.guild(message);

    if (member.roles.cache.has(roleID)) {
      await member.roles.remove(roleID);

      return message.reply(`you left ${format(args.rank).bold.toString()}`);
    } else {
      await member.roles.add(roleID);

      return message.reply(`you joined ${format(args.rank).bold.toString()}`);
    }
  }).help({
    name: 'rank',
    description: 'Joins or leaves a rank.',
    args: {
      rank: {
        type: 'string',
        description: 'The rank to join / leave.',
      },
    },
  });
}
