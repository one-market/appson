#!/usr/bin/env node
/* eslint no-unused-expressions: 0, func-names: 0 */

const yargs = require('yargs')

const commonArgs = {
  'port': {
    alias: 'p',
    default: 3000,
  },
  'debug-bundle': {
    alias: 'd',
    default: false,
  },
  'typescript': {
    alias: 'ts',
    default: false,
  },
}

const start = Object.assign({}, commonArgs, {
  'css-modules': {
    alias: 'cm',
    default: false,
  },
})

const build = Object.assign({}, commonArgs, {
  'minify': {
    alias: 'm',
    choices: ['uglify', 'babili'],
    default: 'babili',
  },
  'sourceMap': {
    alias: 'sm',
    default: 'cheap-module-source-map',
    choices: [
      'eval',
      'cheap-eval-source-map',
      'cheap-source-map',
      'cheap-module-eval-source-map',
      'cheap-module-source-map',
      'eval-source-map',
      'source-map',
      'inline-source-map',
      'hidden-source-map',
      'nosources-source-map',
    ],
  },
})

yargs
  .usage('$0 <cmd> [args]')
  .command('start', 'run development server', start, () => {
    require('../scripts/start')
  })
  .command('build', 'build production version of app', build, () => {
    require('../scripts/build')
  })
  .help()
  .argv
