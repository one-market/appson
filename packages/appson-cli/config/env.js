/* eslint no-param-reassign: 0 */

const R = require('ramda')

const SHAZAM = /^SHAZAM_/i
const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development')

const env = R.pipe(
  R.filter(key => SHAZAM.test(key)),
  R.reduce(
    (env, key) => {
      env[`process.env.${key}`] = JSON.stringify(process.env[key]).replace(
        '"',
        ''
      )
      return env
    },
    {
      'process.env.NODE_ENV': NODE_ENV,
    }
  )
)

module.exports = env(R.keys(process.env))
