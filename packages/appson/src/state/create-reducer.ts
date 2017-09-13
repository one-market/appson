import { StateTypes, StateReducer, StateReducerMap } from '../../index.d'

import R from 'ramda'
import { handleActions } from 'redux-actions'

type Reducer = StateReducer<any, any>
type ReducerMap = StateReducerMap<any, any>

const reduceIndexed = R.addIndex(R.reduce)

const reducerMap = (types: StateTypes, reducers: ReducerMap): ReducerMap =>
  reduceIndexed((obj, key, idx) =>
    R.merge(obj, { [key]: R.nth(idx, R.values(reducers)) }), {}, types
  )

const createReducer = (initialState: any, types: StateTypes, reducers: ReducerMap): Reducer =>
  handleActions(reducerMap(types, reducers), initialState)

export default createReducer
