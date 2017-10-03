/* eslint max-params: 0 */
const { argv } = require('yargs')
const fs = require('fs')
const path = require('path')
const c = require('chalk')
const filesize = require('filesize')
const gzip = require('gzip-size')
const logUpdate = require('log-update')

const symbols = require('./symbols')
const filenameReplace = require('./filename-replace')

const HAS_GZIP = argv.gzip && argv.p

const placeholder = (text) =>
  c.gray(`${text}:`)

const getFilesize = (file) =>
  filesize(fs.statSync(file).size)

const getGZipFilesize = (file) =>
  filesize(gzip.sync(fs.readFileSync(file, 'utf-8')))

const logWarning = ({ loc, frame, message }) => {
  console.log('')
  console.warn(c.yellow.bold(`---------- WARNING  ----------`))

  if (loc) {
    const line = c.cyan.bold(`(${loc.line}:${loc.column})`)
    console.warn(`${loc.file} ${line}`)
    console.warn(`${c.yellow(message)}`)
    if (frame) {
      console.warn('')
      console.warn(`${c.gray(frame)}`)
    }
  } else {
    console.warn(`${c.yellow(message)}`)
    console.log('')
  }
}

exports.compiling = (relative) => {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  let i = 0

  return setInterval(() => {
    const frame = frames[i = ++i % frames.length]
    logUpdate(`${c.dim(frame)} Compiling ${c.cyan.bold(relative)}...`)
  }, 80)
}

exports.success = (root, context, input, output, warning) => {
  const file = filenameReplace(context, input, output.filename)
  const outputFile = path.join(output.dest, file)

  const successTitle = `${symbols.success}  ${c.green.bold('Successfully compiled:')}`
  const warningTitle = `${symbols.warning}  ${c.yellow.bold('Compiled with warnings:')}`
  const title = warning ? warningTitle : successTitle
  const size = `${placeholder('size')} ${getFilesize(outputFile)}`
  const gzip = HAS_GZIP ? ` | ${placeholder('gzip')} ${getGZipFilesize(outputFile)}` : ''
  const sizes = c.gray.dim(`(${size}${gzip})`)

  const msg = `${title} ${c.cyan(path.relative(root, outputFile))} ${sizes}`

  logUpdate(msg)
  if (warning) logWarning(warning)
  logUpdate.done()
}
