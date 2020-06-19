import { table } from 'table';

export class MessageTable {
  private headers: string[];
  private data: string[][];

  constructor(headers: string[]) {
    this.headers = headers;
    this.data = [];
  }

  rows(rows: string[][]): void {
    this.data = this.data.concat(rows);
  }

  toString(): string {
    return table([
      this.headers,
      ...this.data,
    ]);
  }
}
