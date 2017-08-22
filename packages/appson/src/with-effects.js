import t from 'prop-types'
import React, { PureComponent } from 'react'

import { toggleEffects } from '../utils/stores/effects'
import { isModel } from './model'

const atComponent = (effects, WrappedComponent) =>
  class WithEffects extends PureComponent {
    static contextTypes = {
      effects: t.object,
    }

    dispatchAction = () =>
      this.context.effects.dispatch(toggleEffects(effects))

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
