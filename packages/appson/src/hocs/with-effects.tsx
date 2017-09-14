import { Effects } from '../../index.d'

import t from 'prop-types'
import React, { ComponentType as CompType, PureComponent } from 'react'
import { Store } from 'redux'
import State, { isState } from '../state'
import { toggleEffects } from '../stores/effects'

type Context = {
  effects: Store<any>,
}

const atComponent = (effects: Effects, WrappedComponent: CompType): CompType =>
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

const atState = (effects: Effects, state: State): State => {
  if (effects) state.setEffects(effects)
  return state
}

const withEffects = (effects: Effects) => (resource: any): any =>
  isState(resource) ? atState(effects, resource) : atComponent(effects, resource)

export default withEffects
