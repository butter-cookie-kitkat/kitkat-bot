import { CommandRegistrator } from './types';
import { embeds } from '../utils/embeds';
import { EmbedField, MessageEmbed } from 'discord.js';
import { arrays } from '../utils/arrays';
import { KitkatBotCommandError } from '../types';
import { format } from '../utils/formatters';
import { Command } from '@butter-cookie-kitkat/discord-core/dist/command';

function GroupHelp(group: string, helps: Command.HelpInternal[]): MessageEmbed {
  const groupHelps = helps.filter((help) => help.group === group);

  return embeds.success({
    title: ['Help', group],
    fields: [{
      name: 'Names',
      value: groupHelps.map((help) => help.example).join('\n'),
      inline: true,
    }, {
      name: 'Description',
      value: groupHelps.map((help) => help.description).join('\n'),
      inline: true,
    }],
  });
}

/**
 * Outputs the Help Information
 */
export const help: CommandRegistrator = (bot) => {
  bot.command([
    'help',
    'help <name>',
  ], async ({ message, args }) => {
    let helps: (null|Command.HelpInternal|Command.HelpInternal[]) = null;
    let group: (null|string) = null;

    if (args.name) {
      helps = bot.help(args.name);

      if (!helps) {
        helps = bot.help().filter((help) => help.group === args.name) || null;
        group = helps.length > 0 ? args.name : null;
      }
    } else {
      helps = bot.help();
    }

    if (!helps) {
      throw new KitkatBotCommandError(`I'm sorry senpai, but that command doesn't exist!`);
    }

    if (Array.isArray(helps)) {
      if (group) {
        return message.channel.send(GroupHelp(group, helps));
      }

      const groups = arrays.unique(helps.map((help) => help.group));

      return groups.reduce(async (previousPromise, group) => {
        await previousPromise;

        await message.channel.send(GroupHelp(group, helps as Command.HelpInternal[]));
      }, Promise.resolve());
    }

    const fields: EmbedField[] = [{
      name: 'Usage',
      value: helps.example ? format(helps.example).code().toString() : '...',
      inline: false,
    }];

    const _args = helps.args ? Object.entries(helps.args) : [];

    if (_args.length) {
      fields.push({
        name: 'Options',
        value: _args.map(([name]) => name).join('\n'),
        inline: true,
      });

      fields.push({
        name: 'Description',
        value: _args.map(([, arg]) => arg.description).join('\n'),
        inline: true,
      })
    }

    return message.channel.send(embeds.success({
      title: ['Help', `.${args.name}`],
      description: `> ${helps.description}`,
      fields: fields,
    }));
  }).help({
    name: 'help',
    description: 'Display a list of the available commands.',
    args: {
      name: 'The name of the group / command to display help information for.',
    },
  })
}
