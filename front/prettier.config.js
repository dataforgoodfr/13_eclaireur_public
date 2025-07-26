/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
    'semi': true,
    'tabWidth': 2,
    'printWidth': 100,
    'singleQuote': true,
    'trailingComma': 'all',
    'jsxSingleQuote': true,
    'bracketSpacing': true,
    'importOrder': ['^react', '^next', '<THIRD_PARTY_MODULES>', '^@components/(.*)$', '^[./]'],
    'importOrderSeparation': true,
    'importOrderSortSpecifiers': true,
    'plugins': ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss']
  };
  
  module.exports = config;