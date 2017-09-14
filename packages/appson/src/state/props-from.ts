import { Selector as BaseSelector, SelectorMap } from '../../index.d'

import R from 'ramda'
import State from '../state'

type Selector = BaseSelector<any, any, any>
type Selectors = SelectorMap<any> | Selector

const isFunc = R.is(Function)
const reduceIndexed = R.addIndex(R.reduce)

const selectorMap = (globalState: any, selectors: Selectors): Selectors =>
  reduceIndexed((obj: object, key: string, idx: number): object => {
    const selector: Selector = R.nth(idx, R.values(selectors))
    const newSelector: Selectors = isFunc(selector) ?
      selector(globalState) :
      selectorMap(globalState, selector)

    return R.assoc(key, newSelector, obj)
  }, {}, R.keys(selectors))

const propsFrom = (...states: State[]) => (globalState: any): Selectors =>
  R.reduce((obj: object, state: State): Selectors =>
    R.merge(obj, selectorMap(globalState, state.getConnectedProps())), {}, states
  )

export default propsFrom
