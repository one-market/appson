import { StateAsReducer, StateSelector } from '../../index.d'

import R from 'ramda'

type Selector = StateSelector<any, any>

const pick = (state: StateAsReducer, keys: string[]): StateAsReducer => {
  if (!keys.length || !state.selectors) return state

  const selectors = R.reduce((obj: object, key: string): object => {
    const [name, replace] = key.split(':')

    const selectedName: string = replace || name
    const selector: Selector = state.selectors[name]

    return R.has(name, state.selectors) ? R.merge(obj, { [selectedName]: selector }) : obj
  }, {}, keys)

  return R.merge(state, { selectors })
}

export default pick
