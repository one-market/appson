/* eslint new-cap: 0 */
process.noDeprecation = true

const webpack = require('webpack')
const merge = require('deepmerge')
const { argv } = require('yargs')
const { Config } = require('webpack-config')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const eslintFormatter = require('react-dev-utils/eslintFormatter')

const paths = require('../paths')
const env = require('../env')
const loadConfig = require('../../utils/load-config')
const parseConfigFile = require('../../utils/parse-config-file')

const HAS_TS = argv.ts
const IS_PROD = (process.env.NODE_ENV === 'production')
const PUBLIC_URL = process.env.PUBLIC_URL || ''
const PUBLIC_PATH = '/'

const BABELRC = parseConfigFile(paths.app.babelrc) || {}
const ESLINTRC = parseConfigFile(paths.app.eslintrc)
const TSLINT = parseConfigFile(paths.app.tslint)

const eslintLoader = {
  loader: require.resolve('eslint-loader'),
  options: {
    eslintPath: require.resolve('eslint'),
    formatter: eslintFormatter,
    baseConfig: ESLINTRC || {
      extends: [require.resolve('eslint-config-appson')],
    },
    ignore: false,
    useEslintrc: false,
  },
}

const babelLoader = {
  loader: require.resolve('babel-loader'),
  options: merge(BABELRC, {
    babelrc: false,
    cacheDirectory: true,
    presets: [require.resolve('babel-preset-appson')],
    env: {
      development: {
        plugins: [require.resolve('react-hot-loader/babel')],
      },
    },
  }),
}

const tslintLoader = {
  loader: require.resolve('tslint-loader'),
  options: {
    tsConfigFile: paths.app.tsconfig,
    configuration: TSLINT || {
      extends: require.resolve('tslint-config-appson'),
    },
  },
}

const tsLoader = {
  loader: require.resolve('ts-loader'),
  options: {
    configFile: paths.app.tsconfig,
  },
}

const config = new Config().merge({
  output: {
    pathinfo: true,
    path: paths.app.build,
    publicPath: PUBLIC_PATH,
  },
  resolve: {
    extensions: ['.css', '.json', '.js', '.jsx', '.ts', '.tsx'],
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
      new ModuleScopePlugin(paths.app.root, [paths.app.packageJson]),
    ],
  },
  module: {
    rules: [...HAS_TS ? [{
      test: /\.(ts|tsx)$/,
      enforce: 'pre',
      include: [paths.app.src.root],
      exclude: /node_modules/,
      use: tslintLoader,
    }, {
      test: /\.(ts|tsx)$/,
      include: [paths.app.src.root],
      exclude: /node_modules/,
      use: [babelLoader, tsLoader],
    }] : [], {
      test: /\.(js|jsx)$/,
      include: [paths.app.src.root],
      exclude: /node_modules/,
      enforce: 'pre',
      use: {
        loader: require.resolve('source-map-loader'),
      },
    }, {
      test: /\.(js|jsx)$/,
      enforce: 'pre',
      include: [paths.app.src.root],
      exclude: /node_modules/,
      use: eslintLoader,
    }, {
      test: /\.(js|jsx)$/,
      include: [paths.app.src.root],
      exclude: /node_modules/,
      use: babelLoader,
    }, {
      test: /\.svg$/,
      include: [paths.app.assets.images, paths.app.nodeModules],
      use: {
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    }, {
      exclude: [
        /\.ejs$/,
        /\.html$/,
        /\.(js|jsx)$/,
        /\.(ts|tsx)$/,
        /\.css$/,
        /\.json$/,
        /\.svg$/,
      ],
      use: {
        loader: require.resolve('url-loader'),
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
