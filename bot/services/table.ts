import { table as api } from 'table';
import { arrays } from '../utils/arrays';

/**
 * Generates a Table Builder.
 *
 * @param headers - the headers to add to the table.
 * @returns the table builder.
 */
export function table(headers: string[]): MessageTable {
  return new MessageTable(headers);
}

class MessageTable {
  private headers: string[];
  private data: string[][];

  constructor(headers: string[]) {
    this.headers = headers;
    this.data = [];
  }

  rows(rows: string[][]): MessageTable {
    this.data.push(...rows);

    return this;
  }

  toString(options: ToStringOptions = {}): string {
    let data = [this.headers, ...this.data];

    if (options.truncate) {
      data = this.truncate(data, options.truncate);
    }

    return api(data, {
      drawHorizontalLine: (index) => [0, 1, data.length].includes(index),
    });
  }

  // Goals
  // - Returns an output that is less than the truncate value.
  // - Returns the maximum possible number of rows.
  // - Should prioritize the firstHalf over the second half.
  private truncate(data: string[][], truncate: number): string[][] {
    const output = api(data, {
      drawHorizontalLine: (index) => [0, 1, data.length].includes(index),
    });

    // Bail early if the incoming data is less then the truncate amount.
    if (output.length < truncate) return data;

    let [first, second] = arrays.split(data);

    while (first.length > 0) {
      const output = api(first, {
        drawHorizontalLine: (index) => [0, 1, first.length].includes(index),
      });

      if (output.length > truncate) {
        // We know the answer is in the first half so discard the second half.

        const lines = output.split('\n');
        lines.splice(lines.length - 2, 1);

        if (lines.join('\n').length < truncate) {
          return first.slice(0, first.length - 2);
        }

        [first, second] = arrays.split(first);
      } else if (output.length < truncate && second) {
        // We know the answer includes the second half.
        const [one, two] = arrays.split(second);

        first.push(...one);
        second = two;
      } else {
        return first;
      }
    }

    return [];
  }
}

export interface ToStringOptions {
  /**
   * The max size of the output.
   */
  truncate?: number;
}
