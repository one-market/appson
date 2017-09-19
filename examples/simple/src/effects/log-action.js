import { takeEvery } from 'redux-saga/effects'

export default function* logActions() {
  yield takeEvery('*', (action) => console.log('action:', action))
}
