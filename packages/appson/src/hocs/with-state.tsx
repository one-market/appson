import {
  Action as BaseAction,
  Reducer as BaseReducer,
  ReducerMap,
  Effects,
} from '../../index.d'

import t from 'prop-types'
import { Store } from 'redux'
import React, { ComponentType as CompType, PureComponent } from 'react'

import State from '../state'
import withEffects from './with-effects'
import { toggleReducer } from '../stores/reducers'

type Action = BaseAction<ReducerMap<any>, any>
type Reducer = BaseReducer<any, Action>

type Context = {
  reducers: Store<any>
}

const withState = (state: State) => (WrappedComponent: CompType): CompType => {
  const name: string = state.getStateName()
  const effects: Effects = state.getEffects()
  const reducer: Reducer = state.getReducer()

  const action: Action = toggleReducer({ [name]: reducer })
  const Component: CompType = effects ? withEffects(effects)(WrappedComponent) : WrappedComponent

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
