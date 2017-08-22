import { fork, take, call } from 'redux-saga/effects'

import appsonChannel from './channel'
import effectsSaga from './effects'
import reducersSaga from './reducers'

function* channelSaga({ store, channel }) {
  while (true) {
    const { type, payload } = yield take(channel)

    if (type === 'reducers') yield fork(reducersSaga, { store, reducers: payload })
    if (type === 'effects') yield fork(effectsSaga, { ...payload })
  }
}

function* rootSaga(store) {
  const channel = yield call(appsonChannel)
  yield fork(channelSaga, { store, channel })
}

export default rootSaga
