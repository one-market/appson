import t from 'prop-types'
import React, { PureComponent } from 'react'
import * as ReactRouter from 'react-router'
import { NavLink } from 'react-router-dom'

import { mountPath } from './Routes'

export type LocationObject = {
  pathname?: string,
  search?: string,
  state?: any,
  hash?: string,
  key?: string,
}

export interface LinkActiveFn {
  (match: ReactRouter.match<any>, location: LocationObject): boolean
}

export interface LinkProps {
  replace?: boolean
  relative?: boolean
  exact?: boolean,
  strict?: boolean,
  activeClassName?: string,
  className?: string,
  activeStyle?: object,
  style?: object,
  to: string
  location?: LocationObject,
  isActive?: LinkActiveFn,
  ariaCurrent?: 'page' | 'step' | 'location' | 'true'
}

export interface LinkContext {
  basePath: string
}

class Link extends PureComponent<LinkProps, {}> {
  context: LinkContext

  static contextTypes = {
    basePath: t.string,
  }

  render(): JSX.Element {
    const { basePath } = this.context
    const { relative, to, ...props } = this.props

    const path = relative ? mountPath(basePath, to) : to

    return (
      <NavLink {...props} to={path} />
    )
  }
}

export default Link
