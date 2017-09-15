import { Selector, SelectorMap } from '../../index.d'

import R from 'ramda'

const isFunc = R.is(Function)
const isObject = R.is(Object)

const isPrimitive = (state: any): boolean =>
  R.isNil(state) || (!isObject(state) && !isFunc(state))

const getInState = (state: any, key: string): any => isObject(state) ? state[key] : state

const stateAsProp = (name: string): SelectorMap => ({
  [name]: (state: any): any => getInState(state, name)
})

const createSelector = (name: string, key: string): Selector<any, any, any> =>
  (state: any): any =>
    getInState(getInState(state, name), key)

const reduceState = (keys: string[]) => (name: string): SelectorMap =>
  R.reduce((obj, key) => R.merge(obj, { [key]: createSelector(name, key) }), {}, keys)

const createSelectors = (name: string, initial: any, selectors: SelectorMap): any => {
  if (isPrimitive(initial)) return stateAsProp(name)
  return R.merge(reduceState(R.keys(initial))(name), selectors || null)
}

export default createSelectors
