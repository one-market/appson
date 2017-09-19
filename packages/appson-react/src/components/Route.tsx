import { RouteProps } from '../../index.d'

import t from 'prop-types'
import React, { PureComponent } from 'react'
import { Route as RRoute } from 'react-router'

type Context = {
  basePath: string,
}

class Route extends PureComponent<RouteProps, {}> {
  childContext: Context

  static childContextTypes = {
    basePath: t.string,
  }

  getChildContext(): Context {
    return {
      basePath: this.props.basePath || '',
    }
  }

  render(): JSX.Element {
    return (
      <RRoute {...this.props} />
    )
  }
}

export default Route
