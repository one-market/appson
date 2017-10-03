import { Effects, Action } from '../state'

import R from 'ramda'
import { createStore, combineReducers, Store, Reducer } from 'redux'
import { symmetricDiff } from '../utils/object/diff'

type EffectsState = Effects
type EffectsAction = Action<Effects>

type ActiveState = object
type ActiveAction = Action<object>

const effects = (state: EffectsState = {}, { type, payload = {} }: EffectsAction): EffectsState =>
  /TOGGLE_EFFECTS/.test(type) ? symmetricDiff(state, payload) : state

const active = (state: ActiveState = {}, { type, payload = {} }: ActiveAction): ActiveState =>
  /SET_ACTIVE_EFFECTS/.test(type) ? payload : state

const root: Reducer<any> = combineReducers({ effects, active })
const store: Store<any> = createStore(root)

export default R.merge(store, { name: 'effects' })

export const toggleEffects = (payload: Effects): EffectsAction => ({
  payload,
  type: '@@appson/TOGGLE_EFFECTS',
})

export const setActiveEffects = (payload: object): ActiveAction => ({
  payload,
  type: '@@appson/SET_ACTIVE_EFFECTS',
})
