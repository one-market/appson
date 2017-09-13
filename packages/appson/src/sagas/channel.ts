import { Store, Channel } from '../../index.d'

import { eventChannel } from 'redux-saga'
import reducers from '../stores/reducers'
import effects from '../stores/effects'

const emitFrom = (emitter: Function) => ({ name, getState }: Store) => () =>
  emitter({ type: name, payload: getState() })

const appsonChannel = (): Channel => eventChannel((emitter: Function) => {
  const emit = emitFrom(emitter)

  reducers.subscribe(emit(reducers))
  effects.subscribe(emit(effects))

  return () => null
})

export default appsonChannel
