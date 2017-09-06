/* eslint camelcase: 0 */
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'
import pkg from './package.json'

const env = process.env.NODE_ENV
const external = [
  'react',
  'react-dom',
  'react-router',
  'redux',
  'redux-saga',
]

const globals = {
  'react-dom': 'reactDom',
  'react': 'React',
  'react-router': 'reactRouter',
  'redux': 'redux',
  'redux-saga': 'createSagaMiddleware',
  'redux-saga/effects': 'effects',
}

const plugins = [
  resolve({
    jsnext: true,
    extensions: ['.js', '.ts'],
  }),
  commonjs(),
  babel({
    exclude: [
      '../../node_modules/**',
      './node_modules/**',
    ],
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(env),
  }),
  sourceMaps(),
  (env === 'production' && uglify({
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false,
    },
  }, minify)),
]

export default [{
  external,
  globals,
  plugins,
  input: './index.js',
  name: 'appson',
  sourcemap: true,
  output: [
    { file: pkg.main, format: 'umd', exports: 'named' },
    { file: pkg.browser, format: 'umd', exports: 'named' },
  ],
}, {
  external,
  globals,
  plugins,
  input: './index.js',
  sourcemap: true,
  output: [
    { file: pkg.main, format: 'cjs', exports: 'named' },
    { file: pkg.module, format: 'es' },
    { file: pkg['jsnext:main'], format: 'es' },
  ],
}]
