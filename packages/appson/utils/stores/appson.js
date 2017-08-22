import { createStore, combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { symmetricDiff } from '../object/diff'

const DEFAULT_REDUCERS = {
  router: routerReducer,
}

const reducers = (state = DEFAULT_REDUCERS, { type, payload }) =>
  /TOGGLE_REDUCER/.test(type) ? symmetricDiff(state, payload) : state

const effects = (state = null, { type, payload }) =>
  /TOGGLE_EFFECTS/.test(type) ? symmetricDiff(state, payload) : state

const active = (state = null, { type, payload }) =>
  /SET_ACTIVE_EFFECTS/.test(type) ? payload : state

const root = combineReducers({
  reducers,
  effects: combineReducers({
    all: effects,
    active,
  }),
})

export default createStore(root)

export const toggleReducer = (payload) => ({
  type: '@@appson/TOGGLE_REDUCER',
  payload,
})

export const toggleEffects = (payload) => ({
  type: '@@appson/TOGGLE_EFFECTS',
  payload,
})

export const setActiveEffects = (payload) => ({
  type: '@@appson/SET_ACTIVE_EFFECTS',
  payload,
})
