export class Debounce {
  static #debounces = {};

  static start(name, callback, delay = 60000) {
    if (Debounce.#debounces[name]) {
      Debounce.clear(name);
    }

    Debounce.#debounces[name] = setTimeout(() => {
      callback();
      Debounce.clear(name);
    }, delay);
  }

  static clear(name) {
    if (!Debounce.#debounces[name]) return;

    clearTimeout(Debounce.#debounces[name]);
    delete Debounce.#debounces[name];
  }
}
