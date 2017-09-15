import { InternalStore, StoresChannel, StoresChannelAction } from '../../index.d'

import { eventChannel } from 'redux-saga'
import states from '../stores/states'
import effects from '../stores/effects'

type EmitterFn = (data: StoresChannelAction) => void
type EmitFn = (store: InternalStore) => () => void

type Channel = () => StoresChannel

const emitFrom = (emitter: EmitterFn): EmitFn => ({ name, getState }) => () =>
  emitter({ storeName: name, state: getState() })

const channel: Channel = () => eventChannel((emitter: EmitterFn): () => void => {
  const emit = emitFrom(emitter)

  states.subscribe(emit(states))
  effects.subscribe(emit(effects))

  return () => null
})

export default channel
