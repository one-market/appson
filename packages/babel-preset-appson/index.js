const path = require('path')
const env = require.resolve('babel-preset-env')
const react = require.resolve('babel-preset-react')
const exportExtensions = require.resolve('babel-plugin-transform-export-extensions')
const objectRestSpread = require.resolve('babel-plugin-transform-object-rest-spread')
const reactJSX = require.resolve('babel-plugin-transform-react-jsx')
const runtime = require.resolve('babel-plugin-transform-runtime')
const reactOptimize = require.resolve('babel-preset-react-optimize')
const syntaxDynamicImport = require.resolve('babel-plugin-syntax-dynamic-import')
const classProperties = require.resolve('babel-plugin-transform-class-properties')

exports.default = {
  presets: [[env, { modules: false }], react],
  plugins: [
    exportExtensions,
    syntaxDynamicImport,
    classProperties,
    [objectRestSpread, { useBuiltIns: true }],
    [reactJSX, { useBuiltIns: true }],
    [
      runtime,
      {
        helpers: false,
        polyfill: false,
        regenerator: true,
        moduleName: path.dirname(require.resolve('babel-runtime/package')),
      },
    ],
  ],
  env: {
    production: {
      presets: [reactOptimize],
    },
  },
}

module.exports = exports.default
