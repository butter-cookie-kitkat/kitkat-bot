/**
 * Gets the contents of a cheerio element.
 *
 * @param element - the cheerio element.
 * @returns The element's contents.
 */
export function getText(element: any): string {
  return element.children
    .reduce((output: string[], child: any) => {
      if (child.children && child.children.length) {
        output.push(getText(child));
      } else if (child.attribs && child.attribs.title) {
        output.push(child.attribs.title);
      } else if (child.data) {
        output.push(child.data.replace(/[\t\n]/g, ''));
      } else if (child.attribs && child.attribs.alt) {
        output.push(child.attribs.alt);
      }

      return output;
    }, [])
    .filter((item: string) => Boolean(item)).join(' ');
}
