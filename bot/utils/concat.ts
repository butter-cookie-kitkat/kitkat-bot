class Concat {
  /**
   * Joins a list of strings together while filtering out falsy values.
   *
   * @param values - a list of strings to join.
   * @returns the joined values.
   */
  join(...values: any[]): string {
    return values.filter(Boolean).join(' ');
  }
}

export const concat = new Concat();
