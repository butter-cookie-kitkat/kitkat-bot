class Debounce {
  #debounces: {
    [key: string]: NodeJS.Timeout;
  } = {};

  start(name: string, callback: () => void, delay = 60000) {
    if (this.#debounces[name]) {
      this.clear(name);
    }

    this.#debounces[name] = setTimeout(() => {
      callback();
      this.clear(name);
    }, delay);
  }

  clear(name: string) {
    if (!this.#debounces[name]) return;

    clearTimeout(this.#debounces[name]);
    delete this.#debounces[name];
  }

  has(name: string): boolean {
    return Boolean(this.#debounces[name]);
  }
}

export const debounce = new Debounce();
