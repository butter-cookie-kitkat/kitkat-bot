import fs from 'fs';
import path from 'path';

/**
 * @typedef Effect
 * @property {string} path - the path to the effect.
 * @property {string} type - the extension of the effect.
 */

/**
 * @typedef {Object<string, Effect>} Effects
 */

export const EFFECTS_DIRECTORY = path.resolve('effects');

export class Effects {
  /**
   * @type {Effects}
   */
  static #effects;

  /**
   * @type {Effects}
   */
  static #public;

  /**
   * @type {Effects}
   */
  static #private;

  /**
   * @type {Effects}
   */
  static get all() {
    if (!this.#effects) {
      this.#effects = fs.readdirSync(EFFECTS_DIRECTORY).reduce((output, file) => {
        const extension = path.extname(file);
        const name = path.basename(file, extension);
        const types = {
          ogg: 'ogg/opus',
          webm: 'webm/opus',
        };

        output[name] = {
          path: path.join(EFFECTS_DIRECTORY, file),
          type: types[extension.replace('.', '')] || 'mp3',
        };
        return output;
      }, {});
    }

    return this.#effects;
  }

  /**
   * @type {Effects}
   */
  static get public() {
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

  /**
   * @type {Effects}
   */
  static get private() {
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
   * @param {string} name - the name of the effect.
   * @param {boolean} includePrivate - whether privat effects should be included.
   * @returns {Effect} the effect with the given name.
   */
  static effect(name, includePrivate) {
    const effect = includePrivate ? this.all[name] : this.public[name];

    return effect || null;
  }
}
