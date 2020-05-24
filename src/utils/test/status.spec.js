import { chance, expect } from './test-utils';
import { available, responseTime, responseTimeEmoji } from '../status';

describe('Utils(Status)', () => {
  describe('func(available)', () => {
    it('should be online if it is available', () => {
      expect(available(true)).equals('_Online_ :green_circle:');
    });

    it('should be offline if it is not available', () => {
      expect(available(false)).equals('_Offline_ :red_circle:');
    });
  });

  describe('func(responseTime)', () => {
    it('should return the formatted response time if one is provided', () => {
      const time = chance.integer(0, 3000);

      expect(responseTime(time)).includes(`_${time}ms_`);
    });

    it('should return N/A if the response time is not provided', () => {
      expect(responseTime(null)).includes(`_N/A_`);
    });
  });

  describe('func(responseTimeEmoji)', () => {
    it('should be sunny if the response time is less than 3 seconds', () => {
      expect(responseTimeEmoji(2999)).equals(':sunny:');
    });

    it('should be cloudy if the response time is between 3 seconds and 10 seconds', () => {
      expect(responseTimeEmoji(3000)).equals(':cloud_rain:');
    });

    it('should be stormy if the response time is between 10 seconds and 60 seconds', () => {
      expect(responseTimeEmoji(10000)).equals(':thunder_cloud_rain:');
    });

    it('should be on fire if the response time is greater than 60 seconds', () => {
      expect(responseTimeEmoji(60001)).equals(':fire:');
    });
  });
});
