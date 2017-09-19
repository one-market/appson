/* eslint camelcase: 0, new-cap: 0 */

const { join, resolve, relative } = require('path')
const { argv } = require('yargs')
const { Config } = require('webpack-config')
const webpack = require('webpack')
const StatsPlugin = require('stats-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')
const postcss = require('../postcss')

const paths = require('../paths')
const loadConfig = require('../../utils/load-config')

const chooseMinifySystem = () =>
  argv.minify === 'uglify' ?
    new UglifyJSPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
        screw_ie8: true,
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
    }) :
    new MinifyPlugin()

const config = new Config().extend(resolve(__dirname, './common.js')).merge({
  devtool: argv.sourceMap,
  entry: {
    main: [
      require.resolve('babel-polyfill'),
      join(paths.app.src.root, 'main'),
    ],
  },
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    sourceMapFilename: 'static/js/[name].[chunkhash:8].js.map',
    devtoolModuleFilenameTemplate: info =>
      relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  module: {
    rules: [{
      test: /\.css$/,
      include: [paths.app.assets.stylesheets, paths.app.nodeModules],
      use: ExtractTextPlugin.extract({
        fallback: require.resolve('style-loader'),
        use: [{
          loader: require.resolve('css-loader'),
          options: { minimize: true },
        }, {
          loader: require.resolve('postcss-loader'),
          options: {
            ident: 'postcss',
            plugins: () => loadConfig('postcss').concat(postcss),
          },
        }],
      }),
    }],
  },
  plugins: [
    new SimpleProgressWebpackPlugin({
      format: 'expanded',
    }),
    chooseMinifySystem(),
    new DuplicatePackageCheckerPlugin(),
    new StatsPlugin('bundle-stats.json', { chunkModules: true }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.app.htmlFile,
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
    new ExtractTextPlugin('static/css/style.[contenthash:8].css'),
    new webpack.LoaderOptionsPlugin({
      debug: false,
    }),
  ],
})

module.exports = config.merge(loadConfig('webpack', config))
