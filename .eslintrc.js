module.exports = {
  root: true,
  extends: 'airbnb-typescript/base',
  plugins: ['prettier'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'no-console': 'error',
  },
  env: {
    node: true,
  },
};
