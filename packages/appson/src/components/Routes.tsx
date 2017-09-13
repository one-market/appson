import { RoutesProps } from '../../index.d'

import R from 'ramda'
import t from 'prop-types'
import React, { PureComponent, Children, ReactElement } from 'react'
import { matchPath, RouterChildContext } from 'react-router'

const isRoot = R.equals('/')

const mergePath = (basePath: string, path: string): string =>
  `${(R.isNil(basePath) || isRoot(basePath)) ? '' : basePath}/${path.substring(1, path.length)}`

export const mountPath = (basePath: string, path: string): string =>
  R.not(R.isNil(path)) ? mergePath(basePath, path) : ''

type Child = ReactElement<{
  path: string,
  from: string,
  exact: boolean,
  strict: boolean,
  basePath: string,
}>

class Routes extends PureComponent<RoutesProps> {
  context: RouterChildContext<RoutesProps>

  static contextTypes = {
    router: t.shape({ route: t.object.isRequired }).isRequired,
  }

  render(): JSX.Element | null {
    const { route } = this.context.router
    const { children } = this.props
    const { location, match } = route
    const { pathname } = location

    const child = Children.map(children, (element: Child): Child | null => {
      if (!React.isValidElement(element)) return null

      const { path: pathProp, exact, strict, from } = element.props

      const path = mountPath(match.path, pathProp || from)
      const computedMatch = path ? matchPath(pathname, { path, exact, strict }) : match
      const basePath = computedMatch && computedMatch.url

      return computedMatch && React.cloneElement(element, {
        basePath,
        path,
      })
    })

    return child.length ? Children.only(child[0]) : null
  }
}

export default Routes
