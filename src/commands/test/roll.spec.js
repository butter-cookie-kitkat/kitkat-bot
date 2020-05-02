import { Random } from '../../utils/random.js';
import { chance, expect, testable, sinon } from '../../utils/test/test-utils.js';
import { roll, rolld4, rolld6, rolld8, rolld12, rolld20, rolld100 } from '../roll.js';

describe('Commands(Roll)', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('command(roll)', () => {
    const test = testable(roll);

    it('should support rolling a number between 1 and the given max', async () => {
      const max = chance.integer({ min: 2 });
      sinon.stub(Random, 'integer').returns(max);

      const { message } = await test(null, max);

      sinon.assert.calledOnce(Random.integer);
      sinon.assert.calledWithExactly(Random.integer, 1, max);
      sinon.assert.calledOnce(message.reply);
      const [content] = message.reply.firstCall.args;

      expect(content).includes(max);
    });
  });

  describe('command(rolld4)', () => {
    const test = testable(rolld4);

    it('should have an alias of roll4', () => {
      expect(rolld4.aliases).deep.equals(['roll4']);
    });

    it('should support rolling a number between 1 and 4', async () => {
      const expectedResult = 3;

      sinon.stub(Random, 'integer').returns(expectedResult);

      const { message } = await test();

      sinon.assert.calledOnce(Random.integer);
      sinon.assert.calledWithExactly(Random.integer, 1, 4);
      sinon.assert.calledOnce(message.reply);
      const [content] = message.reply.firstCall.args;

      expect(content).includes(expectedResult);
    });
  });

  describe('command(rolld6)', () => {
    const test = testable(rolld6);

    it('should have an alias of roll6', () => {
      expect(rolld6.aliases).deep.equals(['roll6']);
    });

    it('should support rolling a number between 1 and 6', async () => {
      const expectedResult = 3;

      sinon.stub(Random, 'integer').returns(expectedResult);

      const { message } = await test();

      sinon.assert.calledOnce(Random.integer);
      sinon.assert.calledWithExactly(Random.integer, 1, 6);
      sinon.assert.calledOnce(message.reply);
      const [content] = message.reply.firstCall.args;

      expect(content).includes(expectedResult);
    });
  });

  describe('command(rolld8)', () => {
    const test = testable(rolld8);

    it('should have an alias of roll8', () => {
      expect(rolld8.aliases).deep.equals(['roll8']);
    });

    it('should support rolling a number between 1 and 8', async () => {
      const expectedResult = 3;

      sinon.stub(Random, 'integer').returns(expectedResult);

      const { message } = await test();

      sinon.assert.calledOnce(Random.integer);
      sinon.assert.calledWithExactly(Random.integer, 1, 8);
      sinon.assert.calledOnce(message.reply);
      const [content] = message.reply.firstCall.args;

      expect(content).includes(expectedResult);
    });
  });

  describe('command(rolld12)', () => {
    const test = testable(rolld12);

    it('should have an alias of roll12', () => {
      expect(rolld12.aliases).deep.equals(['roll12']);
    });

    it('should support rolling a number between 1 and 12', async () => {
      const expectedResult = 3;

      sinon.stub(Random, 'integer').returns(expectedResult);

      const { message } = await test();

      sinon.assert.calledOnce(Random.integer);
      sinon.assert.calledWithExactly(Random.integer, 1, 12);
      sinon.assert.calledOnce(message.reply);
      const [content] = message.reply.firstCall.args;

      expect(content).includes(expectedResult);
    });
  });

  describe('command(rolld20)', () => {
    const test = testable(rolld20);

    it('should have an alias of roll20', () => {
      expect(rolld20.aliases).deep.equals(['roll20']);
    });

    it('should support rolling a number between 1 and 20', async () => {
      const expectedResult = 3;

      sinon.stub(Random, 'integer').returns(expectedResult);

      const { message } = await test();

      sinon.assert.calledOnce(Random.integer);
      sinon.assert.calledWithExactly(Random.integer, 1, 20);
      sinon.assert.calledOnce(message.reply);
      const [content] = message.reply.firstCall.args;

      expect(content).includes(expectedResult);
    });
  });

  describe('command(rolld100)', () => {
    const test = testable(rolld100);

    it('should have an alias of roll100', () => {
      expect(rolld100.aliases).deep.equals(['roll100']);
    });

    it('should support rolling a number between 1 and 100', async () => {
      const expectedResult = 3;

      sinon.stub(Random, 'integer').returns(expectedResult);

      const { message } = await test();

      sinon.assert.calledOnce(Random.integer);
      sinon.assert.calledWithExactly(Random.integer, 1, 100);
      sinon.assert.calledOnce(message.reply);
      const [content] = message.reply.firstCall.args;

      expect(content).includes(expectedResult);
    });
  });
});
