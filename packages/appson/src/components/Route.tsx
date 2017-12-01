import t from 'prop-types'
import React, { PureComponent } from 'react'
import {
  Route as RRoute,
  RouteComponentProps as RRouteComponentProps,
  RouteProps as RRouteProps,
} from 'react-router'

export interface RouteComponentProps<P> extends RRouteComponentProps<P> {}

export interface RouteProps extends RRouteProps {
  basePath?: string | null
}

export type RouteContext = {
  basePath: string
}

class Route extends PureComponent<RouteProps, {}> {
  childContext: RouteContext

  static childContextTypes = {
    basePath: t.string,
  }

  getChildContext(): RouteContext {
    return {
      basePath: this.props.basePath || '',
    }
  }

  render(): JSX.Element {
    return <RRoute {...this.props} />
  }
}

export default Route
