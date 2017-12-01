import { StateMap, Action } from '../state'

import * as R from 'ramda'
import { createStore, Store } from 'redux'
import { symmetricDiff } from '../utils/object/diff'

const states = (
  state: StateMap = {},
  { type, payload }: Action<StateMap>
): StateMap =>
  /TOGGLE_STATE/.test(type) ? symmetricDiff(state, payload) : state

const store: Store<any> = createStore(states)

export default R.merge(store, { name: 'states' })

export const toggleState = (payload: StateMap): Action<StateMap> => ({
  payload,
  type: '@@appson/TOGGLE_STATE',
})
