import { Effects, AddEffectsFn, InternalStore } from '../../index.d'

import t from 'prop-types'
import React, { ComponentType, PureComponent } from 'react'
import State from '../state'
import { toggleEffects } from '../stores/effects'

type Context = {
  effects: InternalStore,
}

const atComponent = (effects: Effects, WrappedComponent: ComponentType): ComponentType =>
  class AddEffectsComponent extends PureComponent {
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

const atState = (effects: Effects, state: State): State => {
  if (effects) state.setEffects(effects)
  return state
}

const addEffects: AddEffectsFn = (effects) => (resource) =>
  resource instanceof State ? atState(effects, resource) : atComponent(effects, resource)

export default addEffects
