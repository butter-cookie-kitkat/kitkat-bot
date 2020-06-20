import { Message, MessageEmbed, EmbedField } from 'discord.js';
import { format } from './formatters';
import { EMBED_COLORS } from '../constants';

export class Embeds {
  static success(options: SuccessEmbedOptions = {}): MessageEmbed {
    return new MessageEmbed({
      ...options,
      color: EMBED_COLORS.SUCCESS,
    });
  }

  static error(error: Error, message: Message): MessageEmbed {
    const fields = [{
      name: 'Author',
      value: format(`${message.author.username}#${message.author.discriminator}`).italics.toString(),
      inline: true,
    }, {
      name: 'Command',
      value: format(message.content).code().toString(),
      inline: true,
    }]

    if (error.stack) {
      fields.push({
        name: 'Stack Trace',
        value: format(error.stack).truncate({ length: 3000, line: true }).code({ multi: true }).toString(),
        inline: false,
      });
    }

    return new MessageEmbed({
      title: 'Error!',
      description: error.message,
      color: EMBED_COLORS.ERROR,
      fields: fields,
    });
  }
}

export interface SuccessEmbedOptions {
  title?: string;
  description?: string;
  fields?: EmbedField[];
}
