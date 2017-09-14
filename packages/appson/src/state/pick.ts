import { Selector, SelectorMap } from '../../index.d'

import R from 'ramda'
import State from './'
import { isArrayOfString } from '../utils/invariant'

interface PickPropsFn {
  (value: any, selectors: SelectorMap<any>): SelectorMap<any>
}

const pickAndRename = (oldName: string, newName: string): PickPropsFn =>
  (value: any, selectors: SelectorMap<any>): SelectorMap<any> =>
    R.pipe(R.assoc(newName, value), R.omit([oldName]))(selectors)

const pickInSelectors = (keys: string[], selectors: SelectorMap<any>): SelectorMap<any> =>
  R.reduce((props: SelectorMap<any>, key: string): SelectorMap<any> => {
    const [name, replace] = key.split(':')

    const selector: Selector<any, any, any> = R.prop(name, selectors)
    const pickProps: PickPropsFn = pickAndRename(name, replace || name)

    return R.has(name, props) ? pickProps(selector, props) : props
  }, selectors, keys)

const pick = (state: State, keys: string[]): State => {
  isArrayOfString('keys', keys)

  const selectors: SelectorMap<any> = state.getSelectors()
  const newSelectors = pickInSelectors(keys, selectors)

  !R.isNil(selectors) && state.setConnectedProps(newSelectors)
  return state
}

export default pick
