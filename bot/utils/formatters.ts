/**
 * Returns a formatter for the given value.
 *
 * @param value - the value to format.
 * @returns the formatter instance.
 */
export function format(value: string): Formatter {
  return new Formatter(value);
}

class Formatter {
  #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  /**
   * Adds discord code format tags.
   *
   * @param options - the code format options.
   * @returns the instance.
   */
  code(options: CodeOptions = {}): Formatter {
    options = {
      multi: false,
      ...options,
    };

    const ticks = options.multi ? '```' : '`';
    const newLine = options.multi ? '\n' : '';

    this.#value = [ticks, options.type, newLine, this.#value, newLine, ticks].filter(Boolean).join('');

    return this;
  }

  /**
   * Formats the value as a header.
   *
   * @returns the instance.
   */
  get header(): Formatter {
    this.#value = ['~-~', this.#value, '~-~'].join(' ');

    return this;
  }

  /**
   * Formats the value as bold.
   *
   * @returns the instance.
   */
  get bold(): Formatter {
    this.#value = ['**', this.#value, '**'].join('');

    return this;
  }

  /**
   * Formats the value as italicized.
   *
   * @returns the instance.
   */
  get italics(): Formatter {
    this.#value = ['_', this.#value, '_'].join('');

    return this;
  }

  /**
   * @returns the built value!
   */
  get value(): string {
    return this.#value;
  }
}

export interface CodeOptions {
  /**
   * Whether the code block should be multi-lined.
   *
   * @defaultValue false
   */
  multi?: boolean;

  /**
   * The code syntax type.
   */
  type?: string;
}
