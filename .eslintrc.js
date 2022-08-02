module.exports = {
  root: true,
  extends: 'airbnb-typescript/base',
  plugins: ['prettier'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'no-console': 'error',
    'import/extensions': [
      'off',
      'ignorePackages',
      {
        'js': 'never',
        'jsx': 'never',
        'ts': 'never',
        'tsx': 'never',
      },
    ],
    'import/no-extraneous-dependencies': 'off',
  },
  env: {
    node: true,
  },
};
