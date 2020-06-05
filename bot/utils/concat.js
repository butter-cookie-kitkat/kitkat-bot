export class Concat {
  /**
   * Joins a list of strings together while filtering out falsy values.
   *
   * @param  {...string} strings - a list of strings to join.
   * @returns {string} the joined strings.
   */
  static join(...strings) {
    return strings.filter(Boolean).join(' ');
  }
}
