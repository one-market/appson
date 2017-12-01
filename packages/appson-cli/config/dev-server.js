const historyApiFallback = require('connect-history-api-fallback')
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware')
const hotMiddleware = require('webpack-hot-middleware')

const config = require('./webpack.config')
const paths = require('./paths')

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const host = process.env.HOST || '0.0.0.0'

module.exports = (proxy, allowedHost, compiler) => ({
  disableHostCheck:
    !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
  compress: true,
  clientLogLevel: 'none',
  contentBase: paths.app.public,
  watchContentBase: true,
  hot: true,
  quiet: true,
  noInfo: true,
  publicPath: config.output.publicPath,
  https: protocol === 'https',
  host: host,
  overlay: false,
  public: allowedHost,
  proxy,
  watchOptions: {
    ignored: /node_modules/,
  },
  stats: {
    colors: true,
    chunks: false,
    chunkModules: false,
  },
  setup(app) {
    app.use(hotMiddleware(compiler, { log: false, heartbeat: 2000 }))
    app.use(historyApiFallback())
    app.use(errorOverlayMiddleware())
    app.use(noopServiceWorkerMiddleware())
  },
})
