#!/usr/bin/env node

const path = require('path')
const { exec, ls, sed } = require('shelljs')

const INDEX_DTS = path.resolve(__dirname, '../index.d.ts')

exec('dts-generator --name @onemarket/appson --project ./ --out ./index.d.ts', () => {
  ls(INDEX_DTS).forEach((file) => {
    sed('-i', '/src/', '/lib/', file)
    sed('-i', '/index', '', file)
  })

  ls(INDEX_DTS).forEach((file) => {
    sed('-i', '\'@onemarket/appson/lib\'', '\'@onemarket/appson\'', file)
  })
})

