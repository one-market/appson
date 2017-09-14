import {
  Action as BaseAction,
  ActionFn,
  ActionMap,
} from '../../index.d'

import R from 'ramda'
import { Dispatch } from 'redux'
import State from '../state'

type Action = ActionFn<BaseAction<any, any>, any, any>

const reduceIndexed = R.addIndex(R.reduce)

const actionMap = (dispatch: Dispatch<any>, actions: ActionMap): ActionMap =>
  reduceIndexed((obj: object, key: string, idx: number): object => {
    const action: Action = R.nth(idx, R.values(actions))

    return R.assoc(key, (...args: any[]) => dispatch(action(...args)), obj)
  }, {}, R.keys(actions))

const reducersFrom = (...states: State[]) => (dispatch: Dispatch<any>): ActionMap =>
  R.reduce((obj: object, state: State): ActionMap =>
    R.merge(obj, actionMap(dispatch, state.getActions())), {}, states
  )

export default reducersFrom
