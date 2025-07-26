/**
 * Function that stringify selectors to create a SQL query
 * @param selectors
 * @returns
 */
export function stringifySelectors(selectors: string[] | undefined, prefix?: string): string {
  const formattedPrefix = prefix !== undefined ? `${prefix}.` : '';
  if (selectors == null) {
    return `${formattedPrefix}*`;
  }

  return formattedPrefix + selectors.join(`, ${formattedPrefix}`);
}
