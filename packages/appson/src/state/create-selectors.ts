import { Computed, ComputedMap } from '../state'

type Selector = Computed
type SelectorMap = ComputedMap

import * as R from 'ramda'

const isFunc = R.is(Function)
const isObject = R.is(Object)

const isPrimitive = (state: any): boolean =>
  R.isNil(state) || (!isObject(state) && !isFunc(state))

const getInState = (state: any, key: string): any =>
  isObject(state) ? R.prop(key, state) : state

const createSelector = (key: string): Selector => (state: any): any =>
  getInState(state, key)

const reduceState = (initial: any): SelectorMap =>
  R.reduce((obj: SelectorMap, key: string): SelectorMap =>
    R.assoc(key, createSelector(key), obj), {}, R.keys(initial),
  )

const stateAsProp = (name: string): SelectorMap => ({
  [name]: (state: any): any => getInState(state, name),
})

const createSelectors = (name: string, initial: any, computed: SelectorMap | null): any => {
  if (isPrimitive(initial)) return stateAsProp(name)
  return R.merge(reduceState(initial), computed)
}

export default createSelectors
