import R from 'ramda'
import { createStore, combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

const DEFAULT_REDUCERS = {
  router: routerReducer,
}

const normalize = R.reduce((obj, { name, fn }) => R.assoc(name, fn, obj), {} )
const denormalize = (items) => R.map(name => ({ name, fn: R.prop(name, items) }), R.keys(items))

const diffObjects = (method) => (prev, current) => R.prop(method, R)(
  R.eqProps('name'),
  denormalize(prev),
  denormalize(current),
)

export const diffAndNormalize = (method) => R.pipe(
  diffObjects(method),
  normalize,
)

const diff = diffAndNormalize('symmetricDifferenceWith')

const reducers = (state = DEFAULT_REDUCERS, { type, payload }) =>
  /TOGGLE_REDUCER/.test(type) ? diff(state, payload) : state

const effects = (state = null, { type, payload }) =>
  /TOGGLE_EFFECTS/.test(type) ? diff(state, payload) : state

const activeTasks = (state = null, { type, payload }) =>
  /REPLACE_ACTIVE_TASKS/.test(type) ? payload : state

export const stores = {
  reducers: createStore(reducers),
  effects: createStore(combineReducers({ effects, activeTasks })),
}
