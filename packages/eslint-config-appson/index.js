module.exports = {
  parser: 'babel-eslint',
  extends: [
    'xo',
    'xo-react',
    'xo-react/space',
    'xo-space',
  ],
  rules: {
    'semi': [2, 'never'],
    'comma-dangle': [2, 'always-multiline'],
    'quote-props': 0,
    'curly': 0,
    'new-cap': 0,
    'arrow-parens': 0,
    'object-curly-spacing': 0,
    'no-await-in-loop': 0,
    'capitalized-comments': 0,
    'generator-star-spacing': 0,
    'no-unused-expressions': 0,
    'react/jsx-tag-spacing': 0,
    'unicorn/explicit-length-check': 0,
    'unicorn/filename-case': 0,
    'import/prefer-default-export': 0,
    'import/no-unassigned-import': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/order': 0,
  },
  globals: {
    CONFIG: true,
  },
  env: {
    browser: true,
    node: true,
  },
}