class MathUtils {
  average(...values: number[]): number {
    return values.reduce((output, value) => output + value, 0) / values.length;
  }

  center(...values: number[]): number {
    return this.average(Math.min(...values), Math.max(...values));
  }
}

export const math = new MathUtils();
