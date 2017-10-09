/* eslint camelcase: 0, no-unreachable: 0 */
const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const bluebirdCo = require('bluebird-co')
const c = require('chalk')
const micromatch = require('micromatch')
const async = require('neo-async')
const emoji = require('node-emoji')
const logUpdate = require('log-update')
const { argv } = require('yargs')
const { rm, exit, test, ls } = require('shelljs')
const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const eslint = require('rollup-plugin-eslint')
const gzip = require('rollup-plugin-gzip')
const resolve = require('rollup-plugin-node-resolve')
const sourceMaps = require('rollup-plugin-sourcemaps')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')
const typescript = require('rollup-plugin-typescript')
const tslint = require('rollup-plugin-tslint')
const { minify } = require('uglify-es')

const log = require('../utils/log')
const loadFile = require('../utils/load-file')
const invariant = require('../utils/invariant')
const filenameReplace = require('../utils/filename-replace')

Promise.coroutine.addYieldHandler(bluebirdCo.toPromise)

invariant(
  !test('-f', argv.config),
  `Your project must contain a ${c.bold('libson configuration')} file`
)

const isFn = (val) => val instanceof Function

const ENV = process.env.NODE_ENV
const ROOT_PATH = fs.realpathSync(process.cwd())
const CONFIG = loadFile(argv.config)

invariant(
  !CONFIG.output && isFn(CONFIG.OUTPUT),
  `Your config file need to contains a valid ${c.bold('output')} prop`
)

const CONTEXT = CONFIG.context || ROOT_PATH
const OUTPUT = CONFIG.output
const EXTENSIONS = CONFIG.extensions || argv.extensions
const EXTERNAL = CONFIG.external || []
const GLOBALS = CONFIG.globals || {}
const HAS_GZIP = argv.gzip
const IS_PROD = CONFIG.production || argv.p || ENV === 'production'

const JS_REGEXP = /.(js|jsx)$/
const TS_REGEXP = /.(ts|tsx)$/

const EXTS = EXTENSIONS.join(',').replace(/\./gm, '')
const EXTS_GLOB = `**/*.{${EXTS}}`
const HAS_TS = EXTENSIONS.some(e => TS_REGEXP.test(e))
const HAS_JS = EXTENSIONS.some(e => JS_REGEXP.test(e))
const DEFAULT_EXCLUDE = CONFIG.exclude || []
const DEFAULT_INCLUDE = (CONFIG.include || [EXTS_GLOB])

const resolveWithCtx = (p) => path.resolve(CONTEXT, p)

const filterSelectedExts = (filepath) =>
  micromatch.isMatch(filepath, EXTS_GLOB)

const filterByExt = (ext) => (filepath) =>
  micromatch.isMatch(filepath, ext)

const filterExclude = (filepath) =>
  !micromatch.any(filepath, DEFAULT_EXCLUDE)

const INCLUDE = DEFAULT_INCLUDE.map(resolveWithCtx)
const FILES = ls(INCLUDE).filter(filterExclude).filter(filterSelectedExts)
const JS_FILES = HAS_JS && FILES.filter(filterByExt(JS_REGEXP))
const TS_FILES = HAS_TS && FILES.filter(filterByExt(TS_REGEXP))

const UGLIFY_OPTS = {
  compress: {
    pure_getters: true,
    unsafe: true,
    unsafe_comps: true,
    warnings: false,
  },
}

const PLUGINS = [
  resolve({
    main: true,
    jsnext: true,
    extensions: EXTENSIONS,
    preferBuiltins: true,
  }),
  commonjs({
    namedExports: CONFIG.namedExports || {},
  }),
  (HAS_JS && eslint({ include: JS_FILES })),
  (HAS_TS && tslint({ include: TS_FILES })),
  (HAS_TS && typescript({
    include: TS_FILES,
    typescript: require('typescript'),
  })),
  babel({ include: FILES }),
  replace({ 'process.env.NODE_ENV': JSON.stringify(ENV) }),
  sourceMaps(),
  (IS_PROD && uglify(UGLIFY_OPTS, minify)),
  ((IS_PROD && HAS_GZIP) && gzip()),
]

let warningList = {}

const getInputOpts = (input) => ({
  input,
  plugins: PLUGINS,
  external: EXTERNAL,
  onwarn(warning) {
    warningList[input] = warning
  },
})

const getOutputOpts = (input, { name, dest, filename, format = 'cjs', sourcemap = false }) => {
  invariant(
    format === 'umd' && !name,
    `Please set a ${c.bold('name')} if your bundle has a ${c.bold('UMD')} format`
  )

  const file = path.join(dest, filenameReplace(CONTEXT, input, filename))

  return {
    name,
    format,
    sourcemap,
    file,
    globals: GLOBALS,
    exports: 'named',
  }
}

const clean = (done) => {
  logUpdate(`${emoji.get(':recycle:')}  Cleaning old files...`)

  for (const output of OUTPUT) {
    test('-d', output.dest) && rm('-rf', output.dest)
  }

  logUpdate.done()
  done()
}

const build = Promise.coroutine(function* (input) {
  const relative = path.relative(ROOT_PATH, input)

  for (const output of OUTPUT) {
    const compiling = log.compiling(relative)
    const inputOpts = getInputOpts(input)
    const outputOpts = getOutputOpts(input, output)

    try {
      const bundle = yield rollup(inputOpts)
      yield bundle.write(outputOpts)
      log.success(ROOT_PATH, CONTEXT, input, output, warningList[input])
    } catch (err) {
      console.log(c.red(err))
      exit(1)
    }

    clearInterval(compiling)
  }
})

const buildLib = (done) => {
  logUpdate(`${emoji.get(':rocket:')}  Start compiling...`)

  for (const file of FILES) build(file)
  logUpdate.done()
  done()
}

async.series([clean, buildLib])
