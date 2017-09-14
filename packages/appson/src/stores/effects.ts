import { Effects, BaseAction } from '../../index.d'

import R from 'ramda'
import { createStore, combineReducers, Store, Reducer } from 'redux'

import { symmetricDiff } from '../utils/object/diff'

type EffectsState = Effects
type EffectsAction = BaseAction<Effects>

type ActiveState = object
type ActiveAction = BaseAction<object>

const effects = (state: EffectsState = {}, { type, payload = {} }: EffectsAction): EffectsState =>
  /TOGGLE_EFFECTS/.test(type) ? symmetricDiff(state, payload) : state

const active = (state: ActiveState = {}, { type, payload = {} }: ActiveAction): ActiveState =>
  /SET_ACTIVE_EFFECTS/.test(type) ? payload : state

const root: Reducer<any> = combineReducers({ effects, active })
const store: Store<any> = createStore(root)

export default R.merge(store, { name: 'effects' })

export const toggleEffects = (payload: Effects): EffectsAction => ({
  type: '@@appson/TOGGLE_EFFECTS',
  payload,
})

export const setActiveEffects = (payload: object): ActiveAction => ({
  type: '@@appson/SET_ACTIVE_EFFECTS',
  payload,
})
