const cache = {};

export function debounce(name, cb, delay = 5000) {
  if (cache[name]) {
    clear(name);
  }

  cache[name] = setTimeout(() => {
    cb();
    clear(name);
  }, delay);
}

export function clear(name) {
  if (cache[name]) {
    clearTimeout(cache[name]);
    delete cache[name];
  }
}
