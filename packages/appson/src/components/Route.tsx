import t from 'prop-types'
import React, { PureComponent } from 'react'
import * as ReactRouter from 'react-router'

export interface RouteComponentProps<P> extends ReactRouter.RouteComponentProps<P> {}

export interface RouteProps extends ReactRouter.RouteProps {
  basePath?: string | null,
}

export type RouteContext = {
  basePath: string,
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
    return (
      <ReactRouter.Route {...this.props} />
    )
  }
}

export default Route
