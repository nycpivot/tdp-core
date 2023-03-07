/** @type {import('@typescript-eslint/utils/dist/ts-eslint').Linter.Config} */
module.exports = {
  env: {
    commonjs: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/all',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    'plugin:regexp/all',
  ],
  ignorePatterns: ['dist/', 'coverage/', '.eslintrc.js', 'jest.config.js'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    project: 'tsconfig.json',
  },
  rules: {
    '@typescript-eslint/init-declarations': 'off',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off', // yields false positives in combination w/@typescript-eslint/no-parameter-properties
    'consistent-return': 'off',
    'default-case': 'off', // Use Typescript's exhaustive switch assertion instead
    'no-console': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'index', 'parent', 'sibling', 'object', 'type'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
      },
    ],
  },
}
