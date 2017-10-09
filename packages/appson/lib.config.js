const path = require('path')
const pkg = require('./package.json')

const SRC = path.resolve(__dirname, './src')
const LIB = path.resolve(__dirname, './lib')
const ES = path.resolve(__dirname, './es')

const external = [
  ...Object.keys(pkg.peerDependencies),
  'history/createHashHistory',
  'history/createBrowserHistory',
]

module.exports = {
  external,
  context: SRC,
  extensions: ['.ts', '.tsx'],
  output: [{
    filename: '[dir]/[name].js',
    dest: LIB,
    format: 'cjs',
    sourcemap: true,
  }, {
    filename: '[dir]/[name].js',
    dest: ES,
    format: 'es',
    sourcemap: true,
  }],
  namedExports: {
    '../../node_modules/react-hot-loader/index.js': ['AppContainer'],
  },
}
