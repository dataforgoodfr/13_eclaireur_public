/**
 * Function that stringify selectors to create a SQL query
 * @param selectors
 * @returns
 */
export function stringifySelectors(selectors: string[] | undefined): string {
  if (selectors == null) {
    return '*';
  }

  return selectors.join(', ');
}
