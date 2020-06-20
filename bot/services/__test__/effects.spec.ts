import path from 'path';
import { expect } from 'chai';

import { chance } from '../../__test__/chance';

import { service as EffectsService } from '../effects';

describe('Service(Effects)', () => {
  describe('func(effect)', () => {
    it('should resolve the effect information', () => {
      const effect = EffectsService.effect('wow');

      expect(effect).deep.equals({
        path: path.resolve('./effects/wow.webm'),
        type: 'webm/opus',
      });
    });

    it('should support retrieving private effects', () => {
      const effect = EffectsService.effect('private.discord-notification', true);

      expect(effect).deep.equals({
        path: path.resolve('./effects/private.discord-notification.webm'),
        type: 'webm/opus',
      });
    });

    it('should hide private effects by default', () => {
      const effect = EffectsService.effect('private.discord-notification');

      expect(effect).equals(null);
    });

    it('should return null if the effect does not exist', () => {
      const effect = EffectsService.effect(chance.string());

      expect(effect).equals(null);
    });
  });

  describe('prop(all)', () => {
    it('should include public and private effects', () => {
      expect(Object.keys(EffectsService.all).length).equals(
        Object.keys(EffectsService.public).length + Object.keys(EffectsService.private).length,
      );
    });
  });

  describe('prop(public)', () => {
    it('should include public effects only', () => {
      expect(Object.keys(EffectsService.public).length).equals(
        Object.keys(EffectsService.all).length - Object.keys(EffectsService.private).length,
      );
    });
  });

  describe('prop(private)', () => {
    it('should include private effects only', () => {
      expect(Object.keys(EffectsService.private).length).equals(
        Object.keys(EffectsService.all).length - Object.keys(EffectsService.public).length,
      );
    });
  });
});
