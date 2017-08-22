import R from 'ramda'
import { fork, take, call } from 'redux-saga/effects'

import appsonChannel from './channel'
import effectsSaga from './effects'
import reducersSaga from './reducers'

const isReducers = R.equals('reducers')
const isEffects = R.equals('effects')

function* channelSaga({ store, channel }) {
  while (true) {
    const { type, payload } = yield take(channel)

    if (isReducers(type)) yield fork(reducersSaga, { store, reducers: payload })
    if (isEffects(type)) yield fork(effectsSaga, payload)
  }
}

function* rootSaga(store) {
  const channel = yield call(appsonChannel)
  yield fork(channelSaga, { store, channel })
}

export default rootSaga
