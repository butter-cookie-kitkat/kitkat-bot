import { Message, MessageEmbed, EmbedField, MessageEmbedFooter } from 'discord.js';
import { format } from './formatters';
import { EMBED_COLORS } from '../constants';

class Embeds {
  private title(values?: string|string[]): (undefined|string) {
    if (Array.isArray(values)) {
      return values.join(' ¦ ');
    }

    return values;
  }

  success({ title, ...options }: EmbedOptions = {}): MessageEmbed {
    return new MessageEmbed({
      ...options,
      title: this.title(title),
      color: EMBED_COLORS.SUCCESS,
    });
  }

  failure({ title, ...options }: EmbedOptions = {}): MessageEmbed {
    return new MessageEmbed({
      ...options,
      title: title ? this.title(title) : 'Error!',
      color: EMBED_COLORS.ERROR,
    });
  }

  error(error: Error, message: Message): MessageEmbed {
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

    return this.failure({
      description: error.message,
      fields,
    });
  }
}

export interface EmbedOptions {
  title?: (string|string[]);
  url?: string;
  description?: string;
  fields?: EmbedField[];
  footer?: MessageEmbedFooter;
}

export const embeds = new Embeds();
