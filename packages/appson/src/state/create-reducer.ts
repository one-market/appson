import { ActionTypes, Action, Reducer, ReducerMap } from '../../index.d'

import R from 'ramda'
import invariant from 'invariant'
import reduceReducers from 'reduce-reducers'

const reduceIndexed = R.addIndex(R.reduce)

const handleAction = (type: string, reducer: Reducer = R.identity, initialState: any): Reducer => {
  invariant(
    !R.isNil(initialState),
    `initialState for reducer handling ${type} should be defined`
  )

  return (state: any = initialState, action: Action): any => {
    if (R.isNil(action.type) || R.not(R.equals(action.type, type))) return state
    return reducer(state, action)
  }
}

const reducersArr = (reducerMap: ReducerMap, initialState: any): Reducer[] =>
  R.map((type: string): Reducer =>
    handleAction(type, reducerMap[type], initialState), R.keys(reducerMap)
  )

const reducerMap = (types: ActionTypes, reducers: ReducerMap): ReducerMap =>
  reduceIndexed((obj: object, key: string, idx: number): ReducerMap =>
    R.assoc(key, R.nth(idx, R.values(reducers)), obj), {}, types
  )

const createReducer = (initialState: any, types: ActionTypes, reducers: ReducerMap): Reducer => {
  const map: ReducerMap = reducerMap(types, reducers)
  const reducer: Reducer = reduceReducers(...reducersArr(map, initialState))

  return (state: any = initialState, action: Action): any => reducer(state, action)
}

export default createReducer
