import { takeEvery } from 'redux-saga/effects'

export default function* log() {
  yield takeEvery('*', (action) => console.log(action))
}
