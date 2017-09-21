import { AppStore, StoresChannel, StoresChannelAction } from '../../index.d'

import R from 'ramda'
import { fork, take, call } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'

import appsonChannel from './channel'
import effectsSaga from './effects'
import statesSaga from './states'

const isStates = R.equals('states')
const isEffects = R.equals('effects')

export default function* rootSaga(store: AppStore): SagaIterator {
  const channel: StoresChannel = yield call(appsonChannel)

  while (true) {
    const { storeName, state }: StoresChannelAction = yield take(channel)

    if (isEffects(storeName)) yield fork(effectsSaga, state)
    if (isStates(storeName)) yield fork(statesSaga, store, state)
  }
}
