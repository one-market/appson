import {
  ActionTypes,
  Action,
  ActionMap,
  ReducerMap,
} from '../../index.d'

import R from 'ramda'

const isError = R.is(Error)
const reduceIndexed = R.addIndex(R.reduce)

const createAction = (type: string) => (payload: any, meta?: object): Action<any, any> => {
  let action = { type }

  if (isError(payload)) {
    action = R.merge(action, { payload, error: true })
  }

  if (payload && !R.isNil(payload)) {
    action = R.merge(action, { payload })
  }

  if (!R.isNil(meta)) {
    action = R.merge(action, { meta })
  }

  return action
}

const createActions = (types: ActionTypes, reducers: ReducerMap<any>): ActionMap =>
  reduceIndexed((obj: object, key: string, idx: number) =>
    R.assoc(key, createAction(R.nth(idx, types)), obj), {}, R.keys(reducers)
  )

export default createActions
