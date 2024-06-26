module.exports = {
  extends: ['prettier', 'plugin:@typescript-eslint/recommended'],
  plugins: ['prettier', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      { accessibility: 'explicit' },
    ],
    '@typescript-eslint/no-explicit-any': 2,
  },
};
