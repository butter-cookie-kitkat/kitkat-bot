class MathUtils {
  average(...values) {
    return values.reduce((output, value) => output + value, 0) / values.length;
  }

  center(...values) {
    return this.average(Math.min(...values), Math.max(...values));
  }
}

export const math = new MathUtils();
