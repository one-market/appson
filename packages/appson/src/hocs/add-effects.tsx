import t from 'prop-types'
import React, { ComponentType, PureComponent } from 'react'

import { InternalStore } from '../appson'
import State, { Effects } from '../state'
import { toggleEffects } from '../stores/effects'
import getDisplayName from '../utils/get-display-name'

type Context = {
  effects: InternalStore,
}

const atComponent = (effects: Effects, WrappedComponent: ComponentType): ComponentType =>
  class AddEffectsComponent extends PureComponent {
    context: Context

    static displayName: string = getDisplayName(WrappedComponent)

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

const atState = (effects: Effects, state: State<any>): State<any> => {
  if (effects) state.addEffects(effects)
  return state
}

export interface AddEffectsFn {
  <E extends Effects>(effects: E): (resource: React.ComponentType | State<any>) => any
}

const addEffects: AddEffectsFn = (effects) => (resource) =>
  resource instanceof State ? atState(effects, resource) : atComponent(effects, resource)

export default addEffects
