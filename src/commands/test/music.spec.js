import { chance, expect, testable, sinon } from '../../utils/test/test-utils.js';
import { queue } from '../music.js';

describe('Commands(Music)', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('command(queue)', () => {
    const test = testable(queue);

    it('should multiple songs being in the queue', async () => {
      const songs = [{
        title: chance.string(),
        isCurrentSong: true,
        timeRemaining: chance.integer({
          min: 60001,
          max: 69999
        })
      }, {
        title: chance.string(),
        isCurrentSong: false
      }];

      const { message } = await test({
        client: {
          music: {
            songs
          }
        }
      });

      sinon.assert.calledOnce(message.channel.send);
      const [content] = message.channel.send.firstCall.args;

      expect(content).includes('Current Track');
      expect(content).match(/\d+m \d+s/i);

      songs.forEach((song, index) => {
        expect(content).includes(`${index + 1})`);
        expect(content).includes(song.title);
      });
    });

    it('should support no songs being in the queue', async () => {
      const { message } = await test({
        client: {
          music: {
            songs: []
          }
        }
      });

      sinon.assert.calledOnce(message.channel.send);
      const [content] = message.channel.send.firstCall.args;

      expect(content).includes('no songs');
    });
  });
});
