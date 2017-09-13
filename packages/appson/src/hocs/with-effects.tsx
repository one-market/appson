import { Effects, StateAsReducer } from '../../index.d'

import t from 'prop-types'
import React, { ComponentType, PureComponent } from 'react'
import { Store } from 'redux'
import { isState } from '../state'
import { toggleEffects } from '../stores/effects'

type Context = {
  effects: Store<any>,
}

const atComponent = (effects: Effects, WrappedComponent: ComponentType): ComponentType =>
  class WithEffects extends PureComponent {
    context: Context

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

    render(): JSX.Element {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }

const atState = (effects: Effects, state: StateAsReducer): StateAsReducer => {
  effects && Object.defineProperty(state, 'effects', {
    value: effects,
    writable: false,
  })

  return state
}

const withEffects = (effects: Effects) => (resource: any) =>
  isState(resource) ? atState(effects, resource) : atComponent(effects, resource)

export default withEffects
