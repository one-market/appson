/* eslint new-cap: 0 */
process.noDeprecation = true

const fs = require('fs')
const webpack = require('webpack')
const merge = require('deepmerge')
const { Config } = require('webpack-config')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const eslintFormatter = require('react-dev-utils/eslintFormatter')

const paths = require('../paths')
const env = require('../env')
const loadConfig = require('../../utils/load-config')

const IS_PROD = (process.env.NODE_ENV === 'production')
const PUBLIC_URL = process.env.PUBLIC_URL || ''
const PUBLIC_PATH = '/'

const getAppBabelRc = () => {
  let babelrc

  try {
    babelrc = JSON.parse(fs.readFileSync(paths.app.babelrc, 'utf8'))
  } catch (error) {
    babelrc = {}
  }

  return babelrc
}

const getEslintRc = () => {
  let eslintrc

  try {
    eslintrc = JSON.parse(fs.readFileSync(paths.app.eslintrc, 'utf8'))
  } catch (error) {
    eslintrc = {}
  }

  return eslintrc
}

const config = new Config().merge({
  output: {
    pathinfo: true,
    path: paths.app.build,
    publicPath: PUBLIC_PATH,
  },
  resolve: {
    extensions: ['.css', '.json', '.js', '.jsx'],
    modules: [
      paths.app.src.root,
      paths.app.nodeModules,
      paths.app.assets.root,
    ],
    moduleExtensions: ['*-loader'],
    alias: {
      'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator'),
    },
    plugins: [
      new ModuleScopePlugin(paths.app.src.root, [paths.app.packageJson]),
    ],
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      enforce: 'pre',
      include: [paths.app.src.root],
      use: [{
        loader: require.resolve('eslint-loader'),
        options: {
          eslintPath: require.resolve('eslint'),
          formatter: eslintFormatter,
          baseConfig: merge(getEslintRc(), {
            extends: [require.resolve('eslint-config-appson')],
          }),
          ignore: false,
          useEslintrc: false,
        },
      }],
    }, {
      test: /\.(js|jsx)$/,
      include: [paths.app.src.root],
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: merge(getAppBabelRc(), {
          babelrc: false,
          cacheDirectory: true,
          presets: [require.resolve('babel-preset-appson')],
          plugins: [require.resolve('react-hot-loader/babel')],
        }),
      },
    }, {
      test: /\.svg$/,
      include: [paths.app.assets.images, paths.app.nodeModules],
      use: {
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    }, {
      exclude: [
        /\.ejs$/,
        /\.html$/,
        /\.(js|jsx)$/,
        /\.css$/,
        /\.json$/,
        /\.svg$/,
      ],
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    }],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin(env),
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(loadConfig('env')),
    }),
    new InterpolateHtmlPlugin(Object.assign({}, { PUBLIC_URL }, loadConfig('html'))),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: `static/js/vendor${IS_PROD ? '.[chunkhash:8]' : ''}.js`,
      minChunks: ({ resource }) => /node_modules/.test(resource),
    }),
  ],
})

module.exports = config
