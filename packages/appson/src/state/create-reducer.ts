import { ActionTypes, Action, Handler, HandlerMap } from './'

import R from 'ramda'
import invariant from 'invariant'
import reduceReducers from 'reduce-reducers'

const reduceIndexed = R.addIndex(R.reduce)

const handleAction = (type: string, reducer: Handler = R.identity, initialState: any): Handler => {
  invariant(
    !R.isNil(initialState),
    `initialState for reducer handling ${type} should be defined`,
  )

  return (state: any = initialState, action: Action): any => {
    if (R.isNil(action.type) || R.not(R.equals(action.type, type))) return state
    return reducer(state, action)
  }
}

const reducersArr = (map: HandlerMap, initialState: any): Handler[] =>
  R.map((type: string): Handler =>
    handleAction(type, R.prop(type, map), initialState), R.keys(map),
  )

const handlerMap = (types: ActionTypes, handlers: HandlerMap): HandlerMap =>
  reduceIndexed((obj: object, key: string, idx: number): HandlerMap =>
    R.assoc(key, R.nth(idx, R.values(handlers)), obj), {}, types,
  )

const createReducer = (initialState: any, types: ActionTypes, handlers: HandlerMap): Handler => {
  const map: HandlerMap = handlerMap(types, handlers)
  const reducer: Handler = reduceReducers(...reducersArr(map, initialState))

  return (state: any = initialState, action: Action): any => reducer(state, action)
}

export default createReducer
