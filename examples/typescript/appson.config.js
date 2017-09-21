const path = require('path')

exports.webpack = (env, config) => {
  // this is necessary here just because we're using yarn workspaces feature and lib directly
  config.resolve.modules.push(path.resolve(__dirname, '../../node_modules'))
  return config
}

exports.html = () => ({
  TITLE: 'Simple Appson',
})
