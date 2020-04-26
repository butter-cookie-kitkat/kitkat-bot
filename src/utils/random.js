export function integer(start, end) {
  return Math.round(Math.random() * (end - start)) + start;
}

export function item(list) {
  return list[integer(0, list.length - 1)];
}


/**
 * Returns a random boolean.
 * @param {Number} percentage A percentage (0 - 100) representing the likelihood of receiving true.
 * @return {boolean} A random boolean.
 */
export function boolean(percentage = 50) {
  return integer(0, 100) <= percentage;
}
