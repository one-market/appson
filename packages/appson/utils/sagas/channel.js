import { eventChannel } from 'redux-saga'

import reducers from '../stores/reducers'
import effects from '../stores/effects'

const emitFrom = (emitter) => ({ name, getState }) => () =>
  emitter({ type: name, payload: getState() })

const appsonChannel = () => eventChannel((emitter) => {
  const emit = emitFrom(emitter)

  reducers.subscribe(emit(reducers))
  effects.subscribe(emit(effects))

  return () => null
})

export default appsonChannel
