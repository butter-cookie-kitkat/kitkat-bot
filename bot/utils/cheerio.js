/**
 * Gets the contents of a cheerio element.
 *
 * @param {CheerioElement} element the cheerio element.
 * @returns {string} The element's contents.
 */
export function getText(element) {
  return element.children
    .reduce((output, child) => {
      if (child.children && child.children.length) {
        output = output.concat(getText(child));
      } else if (child.attribs && child.attribs.title) {
        output.push(child.attribs.title);
      } else if (child.data) {
        output.push(child.data.replace(/[\t\n]/g, ''));
      } else if (child.attribs && child.attribs.alt) {
        output.push(child.attribs.alt);
      }

      return output;
    }, [])
    .filter((item) => Boolean(item)).join(' ');
}
