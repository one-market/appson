import { StateAsReducer, StateSelector, StateSelectorMap } from '../../index.d'

import R from 'ramda'

const isFunc = R.is(Function)
const reduceIndexed = R.addIndex(R.reduce)

type Selector = StateSelector<any, any>
type Selectors = StateSelectorMap<any, any> | Selector

const mountObject = (globalState: any, selectors: Selectors) => {
  const reduce = reduceIndexed((obj: object, key: string, idx: number): object => {
    const selector: Selector = R.nth(idx, R.values(selectors))

    return R.merge(obj, {
      [key]: isFunc(selector) ? selector(globalState) : mountObject(globalState, selector)
    })
  }, {})

  return reduce(R.keys(selectors))
}

const reducersFrom = (...states: StateAsReducer[]) =>
  (globalState: any) =>
    R.reduce((obj: object, state: StateAsReducer): object =>
      R.merge(obj, mountObject(globalState, state.selectors)), {}, R.values(states)
    )

export default reducersFrom
