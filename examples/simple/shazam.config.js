const path = require('path')

exports.webpackConfig = (env, config) => {
  config.resolve.modules.push(path.resolve(__dirname, '../../node_modules'))
  config.module.rules[0].include.push(path.resolve(__dirname, '../../packages'))
  return config
}

exports.babel = () => ({
  presets: [
    'appson',
  ],
})

exports.htmlData = () => ({
  TITLE: 'Simple Appson',
})
