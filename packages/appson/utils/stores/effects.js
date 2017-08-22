import { combineReducers } from 'redux'
import { symmetricDiff } from '../object/diff'

import createNamedStore from './create-named-store'

const effects = (state = null, { type, payload }) =>
  /TOGGLE_EFFECTS/.test(type) ? symmetricDiff(state, payload) : state

const active = (state = null, { type, payload }) =>
  /SET_ACTIVE_EFFECTS/.test(type) ? payload : state

const root = combineReducers({
  effects,
  active,
})

export default createNamedStore('effects', root)

export const toggleEffects = (payload) => ({
  type: '@@appson/TOGGLE_EFFECTS',
  payload,
})

export const setActiveEffects = (payload) => ({
  type: '@@appson/SET_ACTIVE_EFFECTS',
  payload,
})
