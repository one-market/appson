import * as ReduxSaga from 'redux-saga'

import { InternalStore } from '../appson'
import states from '../stores/states'
import effects from '../stores/effects'

export type StoresChannelAction = {
  storeName: string,
  state: any,
}

export type StoresChannel = ReduxSaga.Channel<StoresChannelAction>

export interface EmitterFn {
  (data: StoresChannelAction): any
}

export interface EmitFn {
  (store: InternalStore): () => any
}

export interface AppsonChannel {
  (): StoresChannel
}

const emitFrom = (emitter: EmitterFn): EmitFn => ({ name, getState }) => () =>
  emitter({ storeName: name, state: getState() })

const channel: AppsonChannel = () => ReduxSaga.eventChannel((emitter: EmitterFn): () => void => {
  const emit = emitFrom(emitter)

  states.subscribe(emit(states))
  effects.subscribe(emit(effects))

  return () => null
})

export default channel
