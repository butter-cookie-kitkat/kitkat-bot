/**
 * Returns a formatter for the given value.
 *
 * @param {string} value - the value to format.
 * @returns {Formatter} the formatter instance.
 */
export function format(value) {
  return new Formatter(value);
}

/**
 * @typedef {Object} CodeOptions
 * @property {boolean} [multi=false] - whether the code block should be multi-lined.
 * @property {string} [type] - the code syntax type. (js, ts, html, etc.)
 */

class Formatter {
  #value;

  constructor(value) {
    this.#value = value;
  }

  /**
   * Adds discord code format tags.
   *
   * @param {CodeOptions} [options] - the code format options.
   * @returns {Formatter} the instance.
   */
  code(options = {}) {
    options = {
      multi: false,
      type: null,
      ...options,
    };

    const ticks = options.multi ? '```' : '`';
    const newLine = options.multi ? '\n' : '';

    this.#value = [ticks, options.type, newLine, this.#value, newLine, ticks].filter(Boolean).join('');

    return this;
  }

  /**
   * Formats the value as bold.
   *
   * @returns {Formatter} the instance.
   */
  get bold() {
    this.#value = ['**', this.#value, '**'].join('');

    return this;
  }

  /**
   * @returns {string} the built value!
   */
  get value() {
    return this.#value;
  }
}
