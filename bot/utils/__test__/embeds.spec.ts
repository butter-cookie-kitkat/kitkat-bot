import { expect } from 'chai';

import { embeds } from '../embeds';
import { EMBED_COLORS } from '../../constants';
import { MessageEmbed, Message, EmbedField } from 'discord.js';
import { format } from '../formatters';
import { chance } from '../../__test__/chance';

describe('Utils(Embeds)', () => {
  describe('func(success)', () => {
    it('should generate an embed object', () => {
      expect(embeds.success()).instanceOf(MessageEmbed);
    });

    it('should set the color the teal', () => {
      expect(embeds.success().color).equals(EMBED_COLORS.SUCCESS);
    });

    it('should support providing a title', () => {
      const expectedTitle = chance.string();

      expect(embeds.success({ title: expectedTitle }).title).equals(expectedTitle);
    });

    it('should support providing a description', () => {
      const expectedDescription = chance.string();

      expect(embeds.success({ description: expectedDescription }).description).equals(expectedDescription);
    });

    it('should support providing fields', () => {
      const expectedField: EmbedField = {
        name: chance.string(),
        value: chance.string(),
        inline: false,
      };

      expect(embeds.success({ fields: [expectedField] }).fields).deep.equals([expectedField]);
    });
  });

  describe('func(error)', () => {
    const error = new Error(`Whoops!`);
    const message = {
      author: {
        username: 'WhoAmI',
        discriminator: '123456',
      },
      content: '.sql select things',
    } as Message;

    const embed = embeds.error(error, message);

    it('should generate an embed object', () => {
      expect(embed).instanceOf(MessageEmbed);
    });

    it('should format the embed as an error', () => {
      expect(embed.title).equals('Error!');
      expect(embed.color).equals(EMBED_COLORS.ERROR);

      expect(embed.description).equals(error.message);

      expect(embed.fields).deep.equals([{
        name: 'Author',
        value: format(`${message.author.username}#${message.author.discriminator}`).italics.toString(),
        inline: true,
      }, {
        name: 'Command',
        value: format(message.content).code().toString(),
        inline: true,
      }, {
        name: 'Stack Trace',
        value: format(error.stack as string).truncate({ length: 3000, line: true }).code({ multi: true }).toString(),
        inline: false,
      }]);
    });
  });
});
