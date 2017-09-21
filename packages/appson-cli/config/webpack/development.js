const { join, resolve } = require('path')
const { Config } = require('webpack-config')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')

const postcss = require('../postcss')
const paths = require('../paths')
const loadConfig = require('../../utils/load-config')

const config = new Config().extend(resolve(__dirname, './common.js')).merge({
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: [
      require.resolve('react-hot-loader/patch'),
      require.resolve('react-dev-utils/webpackHotDevClient'),
      require.resolve('babel-polyfill'),
      join(paths.app.src.root, 'main'),
    ],
  },
  output: {
    pathinfo: true,
    filename: 'static/js/[name].js',
    sourceMapFilename: 'static/js/[name].js.map',
    devtoolModuleFilenameTemplate: info =>
      resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  module: {
    rules: [{
      test: /\.css$/,
      include: [paths.app.assets.stylesheets, paths.app.src.root],
      exclude: /node_modules/,
      use: [{
        loader: require.resolve('style-loader'),
      }, {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
        },
      }, {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => loadConfig('postcss').concat(postcss),
        },
      }],
    }],
  },
  performance: {
    hints: false,
  },
  plugins: [
    new SimpleProgressWebpackPlugin({
      format: 'compact',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.app.assets.htmlFile,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WatchMissingNodeModulesPlugin(paths.app.nodeModules),
    new CaseSensitivePathsPlugin(),
  ],
})

module.exports = config.merge(loadConfig('webpack', config))
