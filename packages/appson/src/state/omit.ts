import { StateAsReducer, StateSelectorMap } from '../../index.d'

import R from 'ramda'

type SelectorMap = StateSelectorMap<any, any>

const omit = (state: StateAsReducer, keys: string[]): StateAsReducer => {
  if (!keys.length || !state.selectors) return state

  const { ...copy }: SelectorMap = state.selectors
  const newSelectors = R.reduce((props: SelectorMap, key: string): SelectorMap =>
    R.has(key, props) ? R.omit([key], props) : props, copy, keys
  )

  return R.merge(state, { selectors: newSelectors })
}

export default omit
