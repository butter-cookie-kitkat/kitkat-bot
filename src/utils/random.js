export class Random {
  static integer(start, end) {
    return Math.round(Math.random() * (end - start)) + start;
  }

  static item(list) {
    return list[Random.integer(0, list.length - 1)];
  }

  /**
   * Returns a random boolean.
   * @param {Number} percentage A percentage (0 - 100) representing the likelihood of receiving true.
   * @return {boolean} A random boolean.
   */
  static boolean(percentage = 50) {
    return Random.integer(0, 100) <= percentage;
  }
}
