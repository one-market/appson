const merge = require('deepmerge')
const eslintFormatter = require('react-dev-utils/eslintFormatter')

const paths = require('./paths')
const loadConfig = require('../utils/load-config')
const parseConfigFile = require('../utils/parse-config-file')

const BABELRC = parseConfigFile(paths.app.babelrc) || {}
const ESLINTRC = parseConfigFile(paths.app.eslintrc)
const TSLINT = parseConfigFile(paths.app.tslint)

exports.sourcemap = {
  loader: require.resolve('source-map-loader'),
}

exports.eslint = {
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

exports.babel = {
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

exports.tslint = {
  loader: require.resolve('tslint-loader'),
  options: {
    tsConfigFile: paths.app.tsconfig,
    configuration: TSLINT || {
      extends: require.resolve('tslint-config-appson'),
    },
  },
}

exports.ts = {
  loader: require.resolve('ts-loader'),
  options: {
    configFile: paths.app.tsconfig,
    happyPackMode: true,
  },
}

exports.file = {
  loader: require.resolve('file-loader'),
  options: {
    name: 'static/media/[name].[hash:8].[ext]',
  },
}

exports.url = {
  loader: require.resolve('url-loader'),
  options: {
    limit: 10000,
    name: 'static/media/[name].[hash:8].[ext]',
  },
}

exports.style = {
  loader: require.resolve('style-loader'),
}

exports.css = {
  loader: require.resolve('css-loader'),
  options: {
    importLoaders: 1,
  },
}

exports.postcss = {
  loader: require.resolve('postcss-loader'),
  options: {
    ident: 'postcss',
    plugins: () => loadConfig('postcss').concat([
      require('postcss-flexbugs-fixes'),
      require('autoprefixer')({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9',
        ],
        flexbox: 'no-2009',
      }),
    ]),
  },
}
