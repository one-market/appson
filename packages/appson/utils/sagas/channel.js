import { eventChannel } from 'redux-saga'

import compareState from '../stores/compare-state'
import appson from '../stores/appson'

const emitFrom = (getState, emitter) => (type) => {
  const compare = compareState(getState, type)
  return compare((payload) => emitter({ type, payload }))
}

const appsonChannel = () => eventChannel((emitter) => {
  const emit = emitFrom(appson.getState, emitter)

  appson.subscribe(emit('reducers'))
  appson.subscribe(emit('effects'))
  return () => null
})

export default appsonChannel
