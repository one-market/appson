import { Effects, Action } from '../../index.d'

import R from 'ramda'
import { createStore, combineReducers, Store, Reducer } from 'redux'

import { symmetricDiff } from '../utils/diff-object'

type EffectsState = Effects | null
type ActiveState = object | null

const effects = (state: EffectsState = null, { type, payload }: Action<Effects>): EffectsState =>
  /TOGGLE_EFFECTS/.test(type) ? symmetricDiff(state, payload) : state

const active = (state: ActiveState = null, { type, payload }: Action<object>): ActiveState =>
  /SET_ACTIVE_EFFECTS/.test(type) ? payload : state

const root: Reducer<any> = combineReducers({ effects, active })
const store: Store<any> = createStore(root)

export default R.merge(store, { name: 'effects' })

export const toggleEffects = (payload: Effects): Action<Effects> => ({
  type: '@@appson/TOGGLE_EFFECTS',
  payload,
})

export const setActiveEffects = (payload: object): Action<Object> => ({
  type: '@@appson/SET_ACTIVE_EFFECTS',
  payload,
})
