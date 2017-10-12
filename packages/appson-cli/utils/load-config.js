const { red } = require('chalk')

const env = require('../config/env')
const paths = require('../config/paths')

let appsonConfig

try {
  appsonConfig = require(paths.app.appsonConfig)
} catch (err) {
  console.log(red(err))
  appsonConfig = {}
}

module.exports = (method, ...rest) => {
  const conf = appsonConfig[method]
  const envName = JSON.parse(env['process.env.NODE_ENV'])
  const params = rest.length ? [envName, ...rest] : [envName]

  if (conf && typeof conf === 'function') {
    return conf(...params)
  }

  return {}
}
