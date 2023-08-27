module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  globals: {
    Bot: true,
    redis: true,
    logger: true,
    plugin: true
  },
  rules: {
    eqeqeq: ['off'],
    'no-use-before-define': 'off',
    'no-unused-expressions': 'off',
    'no-undef': 'off',
    'no-return-assign': 'off'
  }
}
