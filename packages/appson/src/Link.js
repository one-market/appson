import t from 'prop-types'
import React, { PureComponent } from 'react'
import { Link as RLink } from 'react-router-dom'

import { mountPath } from './Routes'

class Link extends PureComponent {
  static contextTypes = {
    basePath: t.string,
  }

  render() {
    const { basePath } = this.context
    const { relative, to, ...props } = this.props

    return (
      <RLink {...props} to={relative ? mountPath(basePath, to) : to} />
    )
  }
}

export default Link
