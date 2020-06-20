import { expect } from 'chai';

import { chance } from '../../__test__/chance';

import { format } from '../formatters';
import { outdent } from 'outdent';

describe('Utils(Formatters)', () => {
  describe('func(format)', () => {
    it('should return the original value', () => {
      const expectedValue = chance.string();

      expect(format(expectedValue).toString()).equals(expectedValue);
    });

    it('should support numbers', () => {
      const expectedValue = chance.integer();

      expect(format(expectedValue).toString()).equals(expectedValue.toString());
    });

    it('should support booleans', () => {
      const expectedValue = chance.bool();

      expect(format(expectedValue).toString()).equals(expectedValue.toString());
    });
  });

  describe('func(code)', () => {
    it('should support formatting the text in code blocks', () => {
      const value = chance.string();

      expect(format(value).code().toString()).equals(`\`${value}\``);
    });

    it('should support formatting the text in multi-line code blocks', () => {
      const value = chance.string();

      expect(format(value).code({ multi: true }).toString()).equals(outdent`
        \`\`\`
        ${value}
        \`\`\`
      `);
    });

    it('should support formatting the text in multi-line code blocks with a syntax type', () => {
      const value = chance.string();

      expect(format(value).code({ multi: true, type: 'js' }).toString()).equals(outdent`
        \`\`\`js
        ${value}
        \`\`\`
      `);
    });
  });

  describe('func(bold)', () => {
    it('should bold the value', () => {
      const value = chance.string();

      expect(format(value).bold.toString()).equals(`**${value}**`);
    });
  });

  describe('func(truncate)', () => {
    it('should truncate the value', () => {
      const result = format(chance.string({ length: 100 })).truncate({ length: 30 }).toString();

      expect(result).length(30);
      expect(result.endsWith('...')).equals(true);
    });

    it('should support custom indicators', () => {
      const expectedIndicator = '^^^';

      const result = format(chance.string({ length: 100 })).truncate({
        length: 30,
        indicator: '^^^',
      }).toString();

      expect(result.endsWith(expectedIndicator)).equals(true);
    });

    it('should support truncating on new line characters', () => {
      const expectedValue = chance.string({ length: 20 });
      const value = outdent`
        ${expectedValue}
        ${chance.string({ length: 20 })}
      `;

      const result = format(value).truncate({
        length: 30,
        line: true,
      }).toString();

      expect(result).equals(outdent`
        ${expectedValue}
        ...
      `);
    });

    it('should support truncating on new line characters', () => {
      const result = format(chance.string({ length: 40 })).truncate({
        length: 30,
        line: true,
      }).toString();

      expect(result).equals('...');
    });

    it('should not truncate when the text is shorter then the max length (line: false)', () => {
      const expectedValue = chance.string({ length: 20 });

      const result = format(expectedValue).truncate({
        length: 30,
      }).toString();

      expect(result).equals(expectedValue);
    });

    it('should not truncate when the text is shorter then the max length (line: true)', () => {
      const expectedValue = chance.string({ length: 20 });

      const result = format(expectedValue).truncate({
        length: 30,
        line: true,
      }).toString();

      expect(result).equals(expectedValue);
    });
  });

  describe('func(toString)', () => {
    it('should automatically get called in certain cases', () => {
      const value = chance.string();

      expect(`${format(value).bold}`).equals(`**${value}**`);
    });
  });
});
