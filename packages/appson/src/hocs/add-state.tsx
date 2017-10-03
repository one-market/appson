import t from 'prop-types'
import React, { ComponentType, PureComponent } from 'react'

import { InternalStore } from '../appson'
import State, { StateMap, Action, Effects } from '../state'
import { toggleState } from '../stores/states'
import getDisplayName from '../utils/get-display-name'
import addEffects from './add-effects'

type Context = {
  states: InternalStore,
}

const atComponent = (state: State<any>, WrappedComponent: ComponentType) => {
  const effects: Effects = state.effects
  const action: Action<StateMap> = toggleState({ [state.name]: state })

  class AddStateComponent extends PureComponent {
    context: Context

    static displayName: string = getDisplayName(WrappedComponent)

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

export interface AddStateFn<S> {
  (state: State<S>): (resource: React.ComponentType | State<any>) => ComponentType | State<any>
}

const addState: AddStateFn<any> = (state) => (resource) =>
  resource instanceof State ? atState(state, resource) : atComponent(state, resource)

export default addState
