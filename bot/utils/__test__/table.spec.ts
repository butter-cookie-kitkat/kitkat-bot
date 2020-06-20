import { expect } from 'chai';

import { chance } from '../../__test__/chance';

import { table } from '../table';

describe('Utils(Table)', () => {
  function GenerateArray(size: number): string[][] {
    return Array(size).fill(null).map(() => [chance.string({ length: 100 }), chance.string({ length: 100 })]);
  }

  it('should create an ascii table', () => {
    const data = [
      ['wilting memories ♫', 'https://www.youtube.com/watch?v=zF32eh6PWPk'],
    ];

    const result = table(['Name', 'URL']).rows(data).toString();

    expect(result).includes('Name');
    expect(result).includes('URL');

    for (const row of data) {
      for (const cell of row) {
        expect(result).includes(cell);
      }
    }

    expect(result.split('\n')).length(6);
  });

  it('should support not having a header', () => {
    const data = [
      ['wilting memories ♫', 'https://www.youtube.com/watch?v=zF32eh6PWPk'],
    ];

    const result = table().rows(data).toString();

    expect(result.split('\n')).length(4);
  });

  describe('prop(truncate)', () => {
    it(`should avoid truncating if we don't need to`, () => {
      const data = GenerateArray(1);

      const result = table(['Name', 'URL']).rows(data).toString({ truncate: 2000 });

      expect(result.split('\n')).length(6);
    });

    it(`should truncate the array`, () => {
      const data = GenerateArray(1000);

      const result = table().rows(data).toString({ truncate: 2000 });

      expect(result.split('\n')).length(9);
    });
  });
});
