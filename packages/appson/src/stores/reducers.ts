import { StateMap, Action } from '../../index.d'

import R from 'ramda'
import { routerReducer } from 'react-router-redux'
import { createStore, Store } from 'redux'

import { symmetricDiff } from '../utils/diff-object'

type ReducersState = object
type ReducersAction = Action<StateMap>

const DEFAULT_REDUCERS = {
  router: routerReducer,
}

const reducers = (state: ReducersState = DEFAULT_REDUCERS, { type, payload }: ReducersAction): ReducersState =>
  /TOGGLE_REDUCER/.test(type) ? symmetricDiff(state, payload) : state

const store: Store<any> = createStore(reducers)

export default R.merge(store, { name: 'reducers' })

export const toggleReducer = (payload: StateMap): ReducersAction => ({
  type: '@@appson/TOGGLE_REDUCER',
  payload,
})
