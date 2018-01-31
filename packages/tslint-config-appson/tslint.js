const path = require('path')

module.exports = {
  rulesDirectory: [
    path.join(
      path.dirname(require.resolve('tslint-consistent-codestyle')),
      './'
    ),
    path.join(
      path.dirname(require.resolve('tslint-eslint-rules')),
      'dist/rules'
    ),
    path.join(path.dirname(require.resolve('tslint-microsoft-contrib')), './'),
    path.join(path.dirname(require.resolve('vrsource-tslint-rules')), 'rules'),
  ],
  rules: {
    'prefer-const': true,
    'no-var-keyword': true,
    'object-literal-shorthand': true,
    'object-shorthand-properties-first': true,
    'object-literal-key-quotes': [true, 'as-needed'],
    'prefer-array-literal': true,
    quotemark: [true, 'single', 'jsx-double'],
    'no-eval': true,
    'no-function-constructor-with-string-args': true,
    'space-before-function-paren': [
      true,
      {
        anonymous: 'always',
        named: 'never',
      },
    ],
    'no-param-reassign': true,
    align: [true, 'parameters', 'statements', 'members'],
    'ter-prefer-arrow-callback': [true],
    'arrow-parens': true,
    'ter-arrow-parens': [true, 'always'],
    'no-duplicate-imports': true,
    'one-variable-per-declaration': [true, 'ignore-for-loop'],
    'no-increment-decrement': false,
    'triple-equals': [true, 'allow-null-check'],
    'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
    'comment-format': [true, 'check-space'],
    indent: [true, 'space'],
    'ter-indent': [true, 2, { SwitchCase: 1 }],
    whitespace: [
      true,
      'check-branch',
      'check-decl',
      'check-operator',
      'check-preblock',
    ],
    eofline: true,
    'space-in-parens': [true, 'never'],
    'array-bracket-spacing': [true, 'never'],
    'object-curly-spacing': [true, 'always'],
    'max-line-length': [true, 100],
    'trailing-comma': [
      true,
      {
        multiline: 'always',
        singleline: 'never',
      },
    ],
    semicolon: [true, 'never'],
    radix: true,
    'no-construct': true,
    'function-name': [
      true,
      {
        'static-method-regex': '^[a-z][\\w\\d]+$',
        'private-method-regex': '^[_]?[a-z][\\w\\d]+$',
      },
    ],
    'variable-name': [
      true,
      'check-format',
      'allow-pascal-case',
      'allow-leading-underscore',
    ],
    'import-name': false,
  },
}
