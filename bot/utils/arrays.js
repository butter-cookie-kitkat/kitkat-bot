export class Arrays {
  /**
   * Chunks a list into a list of lists.
   *
   * @template T
   * @param {T[]} list - the list to chunk
   * @param {*} size - the size of the chunks
   * @returns {T[][]} the chunked array.
   */
  static chunk(list, size) {
    return Array(Math.ceil(list.length / size)).fill().map((_, index) => {
      const start = index * size;

      return list.slice(start, start + size);
    });
  }

  /**
   * Flattens the list of lists into a single list.
   *
   * @template T
   * @param {(T|T[])[]} list - the list to flatten
   * @returns {T[]} the flattened array.
   */
  static flatten(list) {
    return list.reduce((output, item) => {
      if (Array.isArray(item)) {
        output = output.concat(Arrays.flatten(item));
      } else {
        output.push(item);
      }

      return output;
    }, []);
  }
}
