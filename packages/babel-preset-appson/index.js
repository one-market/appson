const env = require('babel-preset-env')
const react = require('babel-preset-react')
const exportExtensions = require('babel-plugin-transform-export-extensions')
const classProperties = require('babel-plugin-transform-class-properties')
const objectRestSpread = require('babel-plugin-transform-object-rest-spread')
const reactJSX = require('babel-plugin-transform-react-jsx')
const runtime = require('babel-plugin-transform-runtime')
const reactOptimize = require('babel-preset-react-optimize')
const macros = require('babel-macros')

module.exports = {
  presets: [
    [env, { modules: false }],
    react,
  ],
  plugins: [
    macros,
    exportExtensions,
    classProperties,
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