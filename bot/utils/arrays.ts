class Arrays {
  /**
   * Chunks a list into a list of lists.
   *
   * @param list - the list to chunk
   * @param size - the size of the chunks
   * @returns the chunked array.
   */
  chunk<T>(list: T[], size: number): T[][] {
    return Array(Math.ceil(list.length / size)).fill(null).map((_, index) => {
      const start = index * size;

      return list.slice(start, start + size);
    });
  }

  /**
   * Flattens the list of lists into a single list.
   *
   * @param list - the list to flatten
   * @returns the flattened array.
   */
  flatten<T>(list: (T|T[])[]): T[] {
    return list.reduce((output: T[], item: (T|T[])) => {
      if (Array.isArray(item)) {
        output = output.concat(this.flatten(item));
      } else {
        output.push(item);
      }

      return output;
    }, []);
  }

  /**
   * Returns a list of unique items.
   *
   * @param list - the list remove duplicates from.
   * @param identifier - the function that returns the identifier.
   * @returns the unique array.
   */
  unique<T>(list: T[], identifier: IdentifierFunction<T>): T[] {
    const ids: any[] = [];

    return list.filter((item) => {
      const id = identifier(item);

      if (ids.includes(id)) {
        return false;
      }

      ids.push(id);
      return true;
    })
  }
}

export const arrays = new Arrays();

export type IdentifierFunction<T> = (item: T) => any;
