import t from 'prop-types'
import React, { PureComponent } from 'react'

import { isModel } from './model'

export const toggleEffects = (payload) => ({
  type: '@appson/TOGGLE_EFFECTS',
  payload,
})

const atComponent = (effects, WrappedComponent) => {
  const action = toggleEffects(effects)

  class WithEffects extends PureComponent {
    static contextTypes = {
      effects: t.object,
    }

    dispatchAction = () =>
      this.context.effects.dispatch(action)

    componentWillMount() {
      this.dispatchAction()
    }

    componentWillUnmount() {
      this.dispatchAction()
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }

  return WithEffects
}

const atModel = (effects, model) => {
  effects && Object.defineProperty(model, 'effects', {
    value: effects,
    writable: false,
  })

  return model
}

const withEffects = (effects) => (resource) =>
  isModel(resource) ? atModel(effects, resource) : atComponent(effects, resource)

export default withEffects
