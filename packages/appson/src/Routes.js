import R from 'ramda'
import t from 'prop-types'
import React, { Children } from 'react'
import { Switch } from 'react-router-dom'
import { matchPath } from 'react-router'

const isRoot = R.equals('/')

const mergePath = (basePath, path) =>
  `${(R.isNil(basePath) || isRoot(basePath)) ? '' : basePath}/${path.substring(1, path.length)}`

export const mountPath = (basePath, path) =>
  R.not(R.isNil(path)) ? mergePath(basePath, path) : null

class Routes extends Switch {
  static contextTypes = {
    router: t.shape({ route: t.object.isRequired }).isRequired,
  }

  render() {
    const { route } = this.context.router
    const { children } = this.props
    const { location, match } = route
    const { pathname } = location

    const child = Children.map(children, (element) => {
      if (!React.isValidElement(element)) return null

      const { path: pathProp, exact, strict, from } = element.props

      const path = mountPath(match.path, pathProp || from)
      const computedMatch = path ? matchPath(pathname, { path, exact, strict }) : match

      return computedMatch && React.cloneElement(element, {
        path,
        location,
        computedMatch,
        basePath: match.path,
      })
    })

    return child.length && R.head(child)
  }
}

export default Routes
