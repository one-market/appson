import {
  State,
  StateSelectorMap,
  StateActionMap,
  StateReducer,
  StateTypes,
  StateAsReducer,
} from '../../index.d'

import R from 'ramda'
import invariant from 'invariant'

import createActions from './create-actions'
import createReducer from './create-reducer'
import createTypes from './create-types'
import createSelectors from './create-selectors'

type Params = State<any, any, any>

export const isState = R.has('stateName')
export const getEffects = R.prop('effects')

const state = ({ name, initial = {}, selectors = {}, reducers = {} }: Params): StateAsReducer => {
  invariant(
    name && typeof name === 'string',
    'You need to set a name as a string for your state'
  )

  const types: StateTypes = createTypes(name, reducers)
  const actions: StateActionMap<any> = createActions(types, reducers)
  const reducer: StateReducer<any, any> = createReducer(state, types, reducers)
  const newSelectors: StateSelectorMap<any, any> = createSelectors(name, initial, selectors)

  return Object.assign(reducer, {
    actions,
    stateName: name,
    selectors: newSelectors,
  })
}

export default state
