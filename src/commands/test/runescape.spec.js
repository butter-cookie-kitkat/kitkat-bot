import { RS3, OSRS } from '../../services/runescape.js';
import { chance, expect, testable, sinon } from '../../utils/test/test-utils.js';
import { ge } from '../runescape.js';

describe('Commands(RuneScape)', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('command(ge)', () => {
    const test = testable(ge);

    it('should support search RS3 and OSRS', async () => {
      const name = chance.string();

      const searchResults = {
        columns: ['Item', 'Members Only', 'Price', 'Change'],
        results: [{
          item: 'Dragon arrow',
          members: true,
          price: '539',
          change: '+8'
        }]
      };

      sinon.stub(RS3, 'search').resolves(searchResults);
      sinon.stub(OSRS, 'search').resolves(searchResults);

      const { message } = await test(null, name);

      sinon.assert.calledWithExactly(RS3.search, name);
      sinon.assert.calledWithExactly(OSRS.search, name);

      sinon.assert.calledOnce(message.reply);
      const [firstMessage] = message.reply.firstCall.args;
      expect(firstMessage).includes(name);

      sinon.assert.calledTwice(message.channel.send);
      const [rs3Message] = message.channel.send.firstCall.args;

      expect(rs3Message).includes('RuneScape 3');
      for (const result of searchResults.results) {
        expect(rs3Message).includes(result.item);
        expect(rs3Message).includes(result.members);
        expect(rs3Message).includes(result.price);
        expect(rs3Message).includes(result.change);
      }

      const [osrsMessage] = message.channel.send.secondCall.args;

      expect(osrsMessage).includes('OldSchool RuneScape');
      for (const result of searchResults.results) {
        expect(osrsMessage).includes(result.item);
        expect(osrsMessage).includes(result.members);
        expect(osrsMessage).includes(result.price);
        expect(osrsMessage).includes(result.change);
      }
    });

    it('should exclude RS3 if it does not have any results', async () => {
      const name = chance.string();

      const searchResults = {
        columns: ['Item', 'Members Only', 'Price', 'Change'],
        results: [{
          item: 'Dragon arrow',
          members: true,
          price: '539',
          change: '+8'
        }]
      };

      sinon.stub(RS3, 'search').resolves({
        columns: ['Item', 'Members Only', 'Price', 'Change'],
        results: []
      });
      sinon.stub(OSRS, 'search').resolves(searchResults);

      const { message } = await test(null, name);

      sinon.assert.calledWithExactly(RS3.search, name);
      sinon.assert.calledWithExactly(OSRS.search, name);

      sinon.assert.calledOnce(message.reply);
      const [firstMessage] = message.reply.firstCall.args;
      expect(firstMessage).includes(name);

      sinon.assert.calledOnce(message.channel.send);

      const [osrsMessage] = message.channel.send.firstCall.args;

      expect(osrsMessage).includes('OldSchool RuneScape');
      for (const result of searchResults.results) {
        expect(osrsMessage).includes(result.item);
        expect(osrsMessage).includes(result.members);
        expect(osrsMessage).includes(result.price);
        expect(osrsMessage).includes(result.change);
      }
    });

    it('should exclude OSRS if it does not have any results', async () => {
      const name = chance.string();

      const searchResults = {
        columns: ['Item', 'Members Only', 'Price', 'Change'],
        results: [{
          item: 'Dragon arrow',
          members: true,
          price: '539',
          change: '+8'
        }]
      };

      sinon.stub(OSRS, 'search').resolves({
        columns: ['Item', 'Members Only', 'Price', 'Change'],
        results: []
      });
      sinon.stub(RS3, 'search').resolves(searchResults);

      const { message } = await test(null, name);

      sinon.assert.calledWithExactly(RS3.search, name);
      sinon.assert.calledWithExactly(OSRS.search, name);

      sinon.assert.calledOnce(message.reply);
      const [firstMessage] = message.reply.firstCall.args;
      expect(firstMessage).includes(name);

      sinon.assert.calledOnce(message.channel.send);
      const [rs3Message] = message.channel.send.firstCall.args;

      expect(rs3Message).includes('RuneScape 3');
      for (const result of searchResults.results) {
        expect(rs3Message).includes(result.item);
        expect(rs3Message).includes(result.members);
        expect(rs3Message).includes(result.price);
        expect(rs3Message).includes(result.change);
      }
    });
  });
});
