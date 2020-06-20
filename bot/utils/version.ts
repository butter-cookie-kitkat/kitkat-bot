class Version {
  /**
   * Returns the shortened 7 character sha.
   *
   * @param sha - the full blown sha.
   * @returns the 7 character sha.
   */
  sha(sha?: string): string {
    if (sha) {
      return sha.substr(0, 7);
    }

    return 'Unknown';
  }
}

export const version = new Version();
