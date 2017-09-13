import { StateReducerMap, StateActionMap, StateTypes } from '../../index.d'

import R from 'ramda'
import { createAction } from 'redux-actions'

type ReducerMap = StateReducerMap<any, any>
type ActionMap = StateActionMap<any>

const createActionsObject = (types: StateTypes) =>
  (obj: object, actionName: string, idx: number) =>
    R.merge({ [actionName]: createAction(types[idx]) }, obj)

const reduceIndexed = R.addIndex(R.reduce)
const createActions = (types: StateTypes, reducers: ReducerMap): ActionMap =>
  reduceIndexed(createActionsObject(types), {}, R.keys(reducers))

export default createActions
