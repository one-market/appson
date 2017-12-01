/*
  eslint
  no-console: 0,
  consistent-return: 0,
  import/imports-first: 0
*/

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

require('../config/env')

const fs = require('fs')
const { argv } = require('yargs')
const chalk = require('chalk')
const webpack = require('webpack')
const clearConsole = require('react-dev-utils/clearConsole')
const WebpackDevServer = require('webpack-dev-server')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const openBrowser = require('react-dev-utils/openBrowser')
const devServerUtils = require('react-dev-utils/WebpackDevServerUtils')

const createDevServerConfig = require('../config/dev-server')
const config = require('../config/webpack.config')
const paths = require('../config/paths')

const HOST = process.env.HOST || '0.0.0.0'
const DEFAULT_PORT = argv.port
const IS_INTERACTIVE = process.stdout.isTTY
const USE_YARN = fs.existsSync(paths.app.yarnLock)

if (!checkRequiredFiles([paths.app.assets.htmlFile])) {
  process.exit(1)
}

devServerUtils
  .choosePort(HOST, DEFAULT_PORT)
  .then(port => {
    if (port === null) return

    const { createCompiler, prepareProxy, prepareUrls } = devServerUtils

    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
    const appName = require(paths.app.packageJson).name
    const urls = prepareUrls(protocol, HOST, port)
    const compiler = createCompiler(webpack, config, appName, urls, USE_YARN)
    const proxySetting = require(paths.app.packageJson).proxy
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic)
    const serverConfig = createDevServerConfig(
      proxyConfig,
      urls.lanUrlForConfig,
      compiler
    )
    const devServer = new WebpackDevServer(compiler, serverConfig)

    devServer.listen(port, HOST, err => {
      if (err) return console.log(err)
      if (IS_INTERACTIVE) clearConsole()

      console.log(chalk.cyan('Starting the development server...\n'))
      openBrowser(urls.localUrlForBrowser)
    })
    ;['SIGINT', 'SIGTERM'].forEach(sig => {
      process.on(sig, () => {
        devServer.close()
        process.exit()
      })
    })
  })
  .catch(err => {
    if (err && err.message) console.log(err.message)
    process.exit(1)
  })
