/* eslint no-else-return: 0 */
const R = require('ramda')
const fs = require('fs')
const path = require('path')
const url = require('url')

const ENV_PUBLIC_URL = process.env.PUBLIC_URL
const appDirectory = fs.realpathSync(process.cwd())

const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath)
const getPublicUrl = appPackageJson =>
  ENV_PUBLIC_URL || require(appPackageJson).homepage

const getNodePaths = R.pipe(
  R.split(process.platform === 'win32' ? ';' : ':'),
  R.filter(Boolean),
  R.filter(folder => !path.isAbsolute(folder)),
  R.map(resolveApp)
)

const ensureSlash = (dir, needsSlash) => {
  const hasSlash = dir.endsWith('/')

  if (hasSlash && !needsSlash) {
    return path.substr(dir, dir.length - 1)
  } else if (!hasSlash && needsSlash) {
    return `${dir}/`
  }

  return dir
}

const getServedPath = appPackageJson => {
  const publicUrl = getPublicUrl(appPackageJson)
  const servedUrl =
    ENV_PUBLIC_URL || (publicUrl ? url.parse(publicUrl).pathname : '/')

  return ensureSlash(servedUrl, true)
}

module.exports = {
  app: {
    root: resolveApp(''),
    src: {
      root: resolveApp('src'),
      modules: resolveApp('src/modules'),
      components: resolveApp('src/components'),
      effects: resolveApp('src/effects'),
      states: resolveApp('src/states'),
    },
    assets: {
      root: resolveApp('assets'),
      stylesheets: resolveApp('assets/stylesheets'),
      images: resolveApp('assets/images'),
      media: resolveApp('assets/media'),
      htmlFile: resolveApp('assets/index.html'),
    },
    yarnLock: resolveApp('yarn.lock'),
    babelrc: resolveApp('.babelrc'),
    eslintrc: resolveApp('.eslintrc'),
    tsconfig: resolveApp('tsconfig.json'),
    tslint: resolveApp('tslint.json'),
    config: resolveApp('config'),
    build: resolveApp('build'),
    appsonConfig: resolveApp('appson.config.js'),
    packageJson: resolveApp('package.json'),
    nodeModules: resolveApp('node_modules'),
  },
  config: resolveOwn('../config'),
  nodeModules: resolveOwn('../node_modules'),
  nodePaths: getNodePaths(process.env.NODE_PATH || ''),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
}
