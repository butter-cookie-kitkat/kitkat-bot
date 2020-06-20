import { table as api } from 'table';

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
    const data = [this.headers, ...this.data];
    let output = api(data, {
      drawHorizontalLine: (index) => [0, 1, data.length].includes(index),
    });

    if (options.truncate) {
      // TODO: Use a more performant algorithm to limit this.
      // e.g. testing it in halves.
      while (output.length > 2000 && data.length > 0) {
        data.pop();

        output = api(data, {
          drawHorizontalLine: (index) => [0, 1, data.length].includes(index),
        });
      }
    }

    return output;
  }
}

export interface ToStringOptions {
  /**
   * The max size of the output.
   */
  truncate?: number;
}
