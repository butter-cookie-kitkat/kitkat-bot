export class Arrays {
  static chunk(list, size) {
    return Array(Math.ceil(list.length / size)).fill().map((_, index) => {
      const start = index * size;

      return list.slice(start, start + size);
    });
  }
}
