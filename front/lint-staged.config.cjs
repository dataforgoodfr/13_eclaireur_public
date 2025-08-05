module.exports = {
  '**/*.{js,ts,tsx,jsx}': ['eslint --cache --fix', 'prettier --write'],
  '**/*.{ts,tsx}': [() => 'tsc --skipLibCheck --noEmit'],
};
