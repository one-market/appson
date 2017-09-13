import { StateAsReducer, StateActionMap } from '../../index.d'

import R from 'ramda'
import { Dispatch } from 'redux'

const reduceIndexed = R.addIndex(R.reduce)

const mountObject = (dispatch: Dispatch<any>, actions: StateActionMap<any>) => {
  const reduce = reduceIndexed((obj: object, key: string, idx: number): object => {
    const action = R.nth(idx, R.values(actions))

    return R.merge(obj, {
      [key]: (...args: any[]) => dispatch(action(...args))
    })
  }, {})

  return reduce(R.keys(actions))
}

const reducersFrom = (...states: StateAsReducer[]) =>
  (dispatch: Dispatch<any>) =>
    R.reduce((obj: object, state: StateAsReducer): object =>
      R.merge(obj, mountObject(dispatch, state.actions)), {}, R.values(states)
    )

export default reducersFrom
