import R from 'ramda'
import { AppStore, StateMap } from '../../index.d'
import { combineReducers, ReducersMapObject } from 'redux'

import State from '../state'

const reducersFrom = (defaultReducers: ReducersMapObject, states: StateMap): ReducersMapObject =>
  R.reduce((reducers: ReducersMapObject, state: State): ReducersMapObject =>
    R.assoc(state.getName(), state.getReducer(), reducers), defaultReducers, R.values(states)
  )

const statesSaga = (store: AppStore, states: StateMap): void =>
  store.replaceReducer(
    combineReducers(reducersFrom(store.defaultReducers, states))
  )

export default statesSaga
