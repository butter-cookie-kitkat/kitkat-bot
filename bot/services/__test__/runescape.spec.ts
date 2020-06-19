import { expect } from 'chai';

import { chance } from '../../utils/chance';

import { RS3, OSRS } from '../runescape';

describe('Service(RuneScape)', () => {
  describe('class(RS3)', () => {
    describe('func(search)', () => {
      it('should support finding items on the GE', async () => {
        const { columns, results } = await RS3.search('Pure Essence');

        expect(columns).to.be.an('array');
        expect(results).to.be.an('array');
        expect(results.length).greaterThan(0);
      }).timeout(5000);

      it('should support finding nothing on the GE', async () => {
        const { results } = await RS3.search(chance.string());

        expect(results.length).equals(0);
      }).timeout(5000);
    });
  });

  describe('class(OSRS)', () => {
    describe('func(search)', () => {
      it('should support finding items on the GE', async () => {
        const { columns, results } = await OSRS.search('Pure Essence');

        expect(columns).to.be.an('array');
        expect(results).to.be.an('array');
        expect(results.length).greaterThan(0);
      }).timeout(5000);

      it('should support finding nothing on the GE', async () => {
        const { results } = await OSRS.search(chance.string());

        expect(results.length).equals(0);
      }).timeout(5000);
    });
  });
});
