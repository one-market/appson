import { AppStore, StateMap } from '../../index.d'

import R from 'ramda'
import { combineReducers, Reducer } from 'redux'

import State from '../state'

const statesSaga = (store: AppStore, states: StateMap): void => {
  const statesReducers = R.mapObjIndexed(
    (state: State<any>): Reducer<any> => state.getRootReducer(), states,
  )

  store.replaceReducer(
    combineReducers({ ...store.defaultReducers, ...statesReducers }),
  )
}

export default statesSaga
