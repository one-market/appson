import t from 'prop-types'
import React, { PureComponent } from 'react'
import { Route as RRoute } from 'react-router'

class Route extends PureComponent {
  static childContextTypes = {
    basePath: t.string,
  }

  getChildContext() {
    return {
      basePath: this.props.computedMatch.url,
    }
  }

  render() {
    return (
      <RRoute {...this.props} />
    )
  }
}

export default Route
