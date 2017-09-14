import { ReducerMap, BaseAction } from '../../index.d'

import R from 'ramda'
import { routerReducer } from 'react-router-redux'
import { createStore, Store } from 'redux'

import { symmetricDiff } from '../utils/object/diff'

type State = object
type Action = BaseAction<ReducerMap<any>>

const DEFAULT_REDUCERS = {
  router: routerReducer,
}

const reducers = (state: State = DEFAULT_REDUCERS, { type, payload }: Action): State =>
  /TOGGLE_REDUCER/.test(type) ? symmetricDiff(state, payload) : state

const store: Store<any> = createStore(reducers)

export default R.merge(store, { name: 'reducers' })

export const toggleReducer = (payload: ReducerMap<any>): Action => ({
  type: '@@appson/TOGGLE_REDUCER',
  payload,
})
