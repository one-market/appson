import { routerReducer } from 'react-router-redux'

import { symmetricDiff } from '../object/diff'
import createNamedStore from './create-named-store'

const DEFAULT_REDUCERS = {
  router: routerReducer,
}

const reducers = (state = DEFAULT_REDUCERS, { type, payload }) =>
  /TOGGLE_REDUCER/.test(type) ? symmetricDiff(state, payload) : state

export default createNamedStore('reducers', reducers)

export const toggleReducer = (payload) => ({
  type: '@@appson/TOGGLE_REDUCER',
  payload,
})
