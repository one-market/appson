/* eslint new-cap: 0 */
process.noDeprecation = true

const webpack = require('webpack')
const { argv } = require('yargs')
const { Config } = require('webpack-config')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HappyPack = require('happypack')

const paths = require('../paths')
const env = require('../env')
const loaders = require('../loaders')
const loadConfig = require('../../utils/load-config')

const IS_PROD = process.env.NODE_ENV === 'production'
const HAPPY_THREAD_POOL = HappyPack.ThreadPool({
  size: process.env.THREADS || 4,
})

const config = new Config().merge({
  resolve: {
    extensions: ['.css', '.json', '.js', '.jsx', '.ts', '.tsx'],
    modules: [paths.app.src.root, paths.app.nodeModules, paths.app.assets.root],
    moduleExtensions: ['*-loader'],
    alias: {
      'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator'),
    },
    plugins: [new ModuleScopePlugin(paths.app.root, [paths.app.packageJson])],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [paths.app.src.root],
        exclude: /node_modules/,
        enforce: 'pre',
        use: loaders.sourcemap,
      },
      {
        //   test: /\.(js|jsx)$/,
        //   enforce: 'pre',
        //   include: [paths.app.src.root],
        //   exclude: /node_modules/,
        //   use: loaders.eslint,
        // }, {
        test: /\.(js|jsx)$/,
        include: [paths.app.src.root],
        exclude: /node_modules/,
        use: 'happypack/loader?id=js',
      },
      {
        test: /\.svg$/,
        include: [paths.app.assets.images, paths.app.nodeModules],
        use: loaders.file,
      },
      {
        exclude: [
          /\.ejs$/,
          /\.html$/,
          /\.(js|jsx)$/,
          /\.(ts|tsx)$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/,
        ],
        use: loaders.url,
      },
    ],
  },
  plugins: [
    new HappyPack({
      id: 'js',
      threadPool: HAPPY_THREAD_POOL,
      loaders: [loaders.babel],
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin(env),
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(loadConfig('env')),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: `static/js/vendor${IS_PROD ? '.[chunkhash:8]' : ''}.js`,
      minChunks: ({ resource }) => /node_modules/.test(resource),
    }),
  ],
})

if (argv.ts) {
  config.module.rules.push(
    {
      test: /\.(ts|tsx)$/,
      enforce: 'pre',
      include: [paths.app.src.root],
      exclude: /node_modules/,
      use: loaders.tslint,
    },
    {
      test: /\.(ts|tsx)$/,
      include: [paths.app.src.root],
      exclude: /node_modules/,
      use: 'happypack/loader?id=ts',
    }
  )

  config.plugins.unshift(
    new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
    }),
    new HappyPack({
      id: 'ts',
      threadPool: HAPPY_THREAD_POOL,
      loaders: [loaders.babel, loaders.ts],
    })
  )
}

module.exports = config
