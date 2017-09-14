import {
  Action as BaseAction,
  ReducerMap,
  Effects,
  AddState,
} from '../../index.d'

import t from 'prop-types'
import { Store } from 'redux'
import React, { ComponentType, PureComponent } from 'react'

import State from '../state'
import addEffects from './add-effects'
import { toggleReducer } from '../stores/reducers'

type Action = BaseAction<ReducerMap<any>, any>

type Context = {
  reducers: Store<any>
}

const atComponent = (state: State, WrappedComponent: ComponentType) => {
  const effects: Effects = state.getEffects()
  const action: Action = toggleReducer({ [state.getStateName()]: state.getReducer() })

  class AddStateComponent extends PureComponent {
    context: Context

    static contextTypes = {
      reducers: t.object,
    }

    dispatchActions = () =>
      this.context.reducers.dispatch(action)

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

const addState: AddState = (state) => (resource) =>
  resource instanceof State ? atState(state, resource) : atComponent(state, resource)

export default addState
