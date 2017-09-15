import {
  StateMap,
  Action,
  Effects,
  AddStateFn,
  InternalStore,
} from '../../index.d'

import t from 'prop-types'
import React, { ComponentType, PureComponent } from 'react'

import State from '../state'
import addEffects from './add-effects'
import { toggleState } from '../stores/states'

type Context = {
  states: InternalStore
}

const atComponent = (state: State, WrappedComponent: ComponentType) => {
  const stateName: string = state.getName()
  const effects: Effects = state.getEffects()
  const action: Action<StateMap> = toggleState({ [stateName]: state })

  class AddStateComponent extends PureComponent {
    context: Context

    static contextTypes = {
      states: t.object,
    }

    dispatchActions = () =>
      this.context.states.dispatch(action)

    componentWillMount() {
      this.dispatchActions()
    }

    componentWillUnmount() {
      this.dispatchActions()
    }

    render(): JSX.Element {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }

  return !!effects ? addEffects(effects)(AddStateComponent) : AddStateComponent
}

const atState = (childState: State, state: State): State => {
  if (childState) state.addChildren(childState)
  return state
}

const addState: AddStateFn = (state) => (resource) =>
  resource instanceof State ? atState(state, resource) : atComponent(state, resource)

export default addState
