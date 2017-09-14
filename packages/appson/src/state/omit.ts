import { SelectorMap } from '../../index.d'

import R from 'ramda'
import State from './'
import { isArrayOfString } from '../utils/invariant'

const omitInSelectors = (keys: string[], selectors: SelectorMap<any>): SelectorMap<any> =>
  R.reduce((props: SelectorMap<any>, key: string): SelectorMap<any> =>
    R.has(key, props) ? R.omit([key], props) : props, selectors, keys
  )

const omit = (state: State, keys: string[]): State => {
  isArrayOfString('keys', keys)

  const selectors: SelectorMap<any> = state.getSelectors()
  const newSelectors: SelectorMap<any> = omitInSelectors(keys, selectors)

  !R.isNil(selectors) && state.setConnectedProps(newSelectors)
  return state
}

export default omit
