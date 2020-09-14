
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  parserOptions:{
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  globals: { chrome: 'readonly' },
  rules: {
    indent: 'off'
    // indent: ['error', 2]
  }
}
