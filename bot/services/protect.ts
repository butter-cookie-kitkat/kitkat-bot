import { Messages } from './messages';
import { Message, GuildMember, Guild } from 'discord.js';
import { KitkatBotCommandError } from '../types';

export class Protect {
  public guild(message: Message): ProtectedGuild {
    if (!this.isGuild(message.guild) || !this.isGuildMember(message.member)) {
      throw new KitkatBotCommandError(Messages.DMS_NOT_ALLOWED);
    }

    return {
      guild: message.guild,
      guildMember: message.member,
    };
  }

  /**
   * Automatically determines if the user is in a voice channel we can join.
   *
   * @param message - The discord message.
   * @returns the protected values.
   */
  public voice(message: Message): ProtectedVoice {
    const guild = this.guild(message);

    if (!guild.guildMember.voice.channelID) {
      throw new KitkatBotCommandError(Messages.NOT_IN_VOICE_CHANNEL);
    }

    return {
      ...guild,
      voiceChannelID: guild.guildMember.voice.channelID,
    }
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

export interface ProtectedVoice extends ProtectedGuild {
  voiceChannelID: string;
}

export type ProtectionCallback<T> = (message: Message) => T;
