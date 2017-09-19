const historyApiFallback = require('connect-history-api-fallback')
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware')
const config = require('./webpack.config')
const paths = require('./paths')

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const host = process.env.HOST || '0.0.0.0'

module.exports = (proxy, allowedHost) => ({
  disableHostCheck: !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
  compress: true,
  clientLogLevel: 'none',
  contentBase: paths.app.public,
  watchContentBase: true,
  hot: true,
  quiet: true,
  noInfo: true,
  publicPath: config.output.publicPath,
  watchOptions: {
    ignored: /node_modules/,
  },
  https: protocol === 'https',
  host: host,
  overlay: false,
  public: allowedHost,
  proxy,
  stats: {
    colors: true,
    chunks: false,
    chunkModules: false,
  },
  setup(app) {
    app.use(historyApiFallback())
    app.use(errorOverlayMiddleware())
    app.use(noopServiceWorkerMiddleware())
  },
})
