import R from 'ramda'
import { model, withEffects } from 'appson'
import { takeEvery } from 'redux-saga/effects'

const products = model({
  name: 'products',
  state: {
    list: ['Product #1', 'Product #2'],
  },
  reducers: {
    add: (state, { payload }) => R.append(payload, state),
  },
})

const effects = {
  *showProducts() {
    yield takeEvery('test', () => console.log('test'))
  },
}

export default withEffects(effects)(products)
