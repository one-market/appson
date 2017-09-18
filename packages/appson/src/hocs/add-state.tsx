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

const atComponent = (state: State<any>, WrappedComponent: ComponentType) => {
  const effects: Effects = state.effects
  const action: Action<StateMap> = toggleState({ [state.name]: state })

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

const atState = (childState: State<any>, state: State<any>): State<any> => {
  if (childState) state.addChild(childState)
  return state
}

const addState: AddStateFn<any> = (state) => (resource) =>
  resource instanceof State ? atState(state, resource) : atComponent(state, resource)

export default addState
