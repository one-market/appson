import { LinkProps } from '../../index.d'

import t from 'prop-types'
import React, { PureComponent } from 'react'
import { NavLink } from 'react-router-dom'

import { mountPath } from './Routes'

interface Context {
  basePath: string
}

class Link extends PureComponent<LinkProps, {}> {
  context: Context

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
