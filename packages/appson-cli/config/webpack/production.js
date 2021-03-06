/* eslint camelcase: 0, new-cap: 0 */

const { join, resolve, relative } = require('path')
const { argv } = require('yargs')
const { Config } = require('webpack-config')
const webpack = require('webpack')
const StatsPlugin = require('stats-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')

const paths = require('../paths')
const loaders = require('../loaders')
const loadConfig = require('../../utils/load-config')

const chooseMinifySystem = () =>
  argv.minify === 'uglify'
    ? new UglifyJSPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            warnings: false,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
          },
          comments: false,
        },
      })
    : new MinifyPlugin()

const PUBLIC_PATH = paths.servedPath
const PUBLIC_URL = PUBLIC_PATH.slice(0, -1)
const shouldUseRelativeAssetPaths = PUBLIC_PATH === './'

const cssFilename = 'static/css/style.[contenthash:8].css'
const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ? { publicPath: Array(cssFilename.split('/').length).join('../') }
  : {}

const config = new Config().extend(resolve(__dirname, './common.js')).merge({
  devtool: argv.sourceMap,
  entry: {
    main: [require.resolve('babel-polyfill'), join(paths.app.src.root, 'main')],
  },
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    sourceMapFilename: 'static/js/[name].[chunkhash:8].js.map',
    path: paths.app.build,
    publicPath: PUBLIC_PATH,
    devtoolModuleFilenameTemplate: info =>
      relative(paths.app.src.root, info.absoluteResourcePath).replace(
        /\\/g,
        '/'
      ),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [paths.app.assets.stylesheets, paths.app.nodeModules],
        use: ExtractTextPlugin.extract(
          Object.assign(
            {
              fallback: require.resolve('style-loader'),
              use: [loaders.css, loaders.postcss],
            },
            extractTextPluginOptions
          )
        ),
      },
    ],
  },
  plugins: [
    chooseMinifySystem(),
    new SimpleProgressWebpackPlugin({
      format: 'expanded',
    }),
    new DuplicatePackageCheckerPlugin(),
    new StatsPlugin('bundle-stats.json', { chunkModules: true }),
    new ExtractTextPlugin(cssFilename),
    new InterpolateHtmlPlugin(
      Object.assign({}, { PUBLIC_URL }, loadConfig('html'))
    ),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.app.assets.htmlFile,
      data: loadConfig('htmlData'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      debug: false,
      options: {
        resolve: {
          extensions: ['.css', '.json', '.js', '.jsx', '.ts', '.tsx'],
        },
      },
    }),
  ],
})

module.exports = config.merge(loadConfig('webpack', config))
