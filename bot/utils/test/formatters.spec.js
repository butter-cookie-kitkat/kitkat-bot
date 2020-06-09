import { expect } from 'chai';

import { chance } from '../chance';

import { format } from '../formatters';
import { outdent } from 'outdent';

describe('Utils(Formatters)', () => {
  describe('func(format)', () => {
    it('should return the original value', () => {
      const expectedValue = chance.string();

      expect(format(expectedValue).value).equals(expectedValue);
    });
  });

  describe('func(code)', () => {
    it('should support formatting the text in code blocks', () => {
      const value = chance.string();

      expect(format(value).code().value).equals(`\`${value}\``);
    });

    it('should support formatting the text in multi-line code blocks', () => {
      const value = chance.string();

      expect(format(value).code({ multi: true }).value).equals(outdent`
        \`\`\`
        ${value}
        \`\`\`
      `);
    });

    it('should support formatting the text in multi-line code blocks with a syntax type', () => {
      const value = chance.string();

      expect(format(value).code({ multi: true, type: 'js' }).value).equals(outdent`
        \`\`\`js
        ${value}
        \`\`\`
      `);
    });
  });

  describe('func(code)', () => {
    it('should bold the value', () => {
      const value = chance.string();

      expect(format(value).bold.value).equals(`**${value}**`);
    });
  });
});
