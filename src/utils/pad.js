export function pad(value, length) {
  const padding = length - value.length;

  return padding > 0 ? ' '.repeat(padding) : '';
}

export function padRight(value, length) {
  return value + pad(value, length);
}

export function padLeft(value, length) {
  return pad(value, length) + value;
}
