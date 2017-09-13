import { StateMap, StateAsReducer, Effects, Action } from '../../index.d'

import t from 'prop-types'
import { Store } from 'redux'
import React, { ComponentType, PureComponent } from 'react'

import { toggleReducer } from '../stores/reducers'
import { getEffects } from '../state'
import withEffects from './with-effects'

type Context = {
  reducers: Store<any>
}

const withState = (state: StateAsReducer) => (WrappedComponent: ComponentType): ComponentType => {
  const effects: Effects = getEffects(state)
  const action: Action<StateMap> = toggleReducer({ [state.stateName]: state })
  const Component: ComponentType = effects ? withEffects(effects)(WrappedComponent) : WrappedComponent

  class AddModels extends PureComponent {
    context: Context

    static contextTypes = {
      reducers: t.object,
    }

    dispatchActions = () => {
      this.context.reducers.dispatch(action)
    }

    componentWillMount() {
      this.dispatchActions()
    }

    componentWillUnmount() {
      this.dispatchActions()
    }

    render() {
      return (
        <Component {...this.props} />
      )
    }
  }

  return AddModels
}

export default withState
