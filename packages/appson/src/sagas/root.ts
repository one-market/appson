import { Store, Channel } from '../../index.d'

import R from 'ramda'
import { fork, take, call } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga';

import appsonChannel from './channel'
import effectsSaga from './effects'
import reducersSaga from './reducers'

const isReducers = R.equals('reducers')
const isEffects = R.equals('effects')

type ChannelParams = {
  store: Store,
  channel: Channel,
}

function* channelSaga({ store, channel }: ChannelParams): SagaIterator {
  while (true) {
    const { type, payload } = yield take(channel)

    if (isEffects(type)) yield fork(effectsSaga, payload)
    if (isReducers(type)) yield fork(reducersSaga, { store, reducers: payload })
  }
}

function* rootSaga(store: Store): SagaIterator {
  const channel = yield call(appsonChannel)
  yield fork(channelSaga, { store, channel })
}

export default rootSaga
