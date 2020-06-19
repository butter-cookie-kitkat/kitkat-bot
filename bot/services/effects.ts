import fs from 'fs';
import path from 'path';

export const EFFECTS_DIRECTORY = path.resolve('effects');

export const TYPES: {
  [key: string]: string;
} = {
  ogg: 'ogg/opus',
  webm: 'webm/opus',
};

export class EffectsService {
  #effects?: Effects;
  #public?: Effects;
  #private?: Effects;

  get all(): Effects {
    if (!this.#effects) {
      this.#effects = fs.readdirSync(EFFECTS_DIRECTORY).reduce((output, file) => {
        const extension = path.extname(file);
        const name = path.basename(file, extension);

        output[name] = {
          path: path.join(EFFECTS_DIRECTORY, file),
          type: TYPES[extension.replace('.', '')] || 'mp3',
        };
        return output;
      }, {} as Effects);
    }

    return this.#effects;
  }

  get public(): Effects {
    if (!this.#public) {
      this.#public = {...this.all};

      for (const name of Object.keys(this.#public)) {
        if (name.includes('private.')) {
          delete this.#public[name];
        }
      }
    }

    return this.#public;
  }

  get private(): Effects {
    if (!this.#private) {
      this.#private = {...this.all};

      for (const name of Object.keys(this.#private)) {
        if (!name.includes('private.')) {
          delete this.#private[name];
        }
      }
    }

    return this.#private;
  }

  /**
   * Returns an effect matching the criteria.
   *
   * @param name - the name of the effect.
   * @param includePrivate - whether private effects should be included.
   * @returns the effect with the given name.
   */
  effect(name: string, includePrivate?: boolean): Effect {
    const effect = includePrivate ? this.all[name] : this.public[name];

    return effect || null;
  }
}

export const service = new EffectsService();

export type Effects = {
  [key: string]: Effect;
};

export interface Effect {
  /**
   * the path to the effect
   */
  path: string;

  /**
   * the extension of the effect
   */
  type: string;
}
