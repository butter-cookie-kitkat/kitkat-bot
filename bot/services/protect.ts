import { intl } from './intl';
import { Message, GuildMember, Guild } from 'discord.js';
import { KitkatBotCommandError } from '../types';

export class Protect {
  public guild(message: Message): ProtectedGuild {
    if (!this.isGuild(message.guild) || !this.isGuildMember(message.member)) {
      throw new KitkatBotCommandError(intl('DMS_NOT_ALLOWED'));
    }

    return {
      guild: message.guild,
      guildMember: message.member,
    };
  }

  private isGuild(guild: (null|Guild)): guild is Guild {
    return Boolean(guild);
  }

  private isGuildMember(member: (null|GuildMember)): member is GuildMember {
    return Boolean(member);
  }
}

export const service = new Protect();

export interface ProtectedGuild {
  guild: Guild;
  guildMember: GuildMember;
}

export type ProtectionCallback<T> = (message: Message) => T;
