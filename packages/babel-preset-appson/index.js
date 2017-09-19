const env = require('babel-preset-env')
const react = require('babel-preset-react')
const exportExtensions = require('babel-plugin-transform-export-extensions')
const objectRestSpread = require('babel-plugin-transform-object-rest-spread')
const reactJSX = require('babel-plugin-transform-react-jsx')
const runtime = require('babel-plugin-transform-runtime')
const reactOptimize = require('babel-preset-react-optimize')

exports.default = {
  presets: [
    [env, { modules: false }],
    react,
  ],
  plugins: [
    exportExtensions,
    [objectRestSpread, { useBuiltIns: true }],
    [reactJSX, { useBuiltIns: true }],
    [runtime, {
      helpers: false,
      polyfill: false,
      regenerator: true,
    }],
  ],
  env: {
    production: {
      presets: [
        reactOptimize,
      ],
    },
  },
}

module.exports = exports.default
