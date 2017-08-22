import R from 'ramda'
import { model } from 'appson'

const products = model({
  name: 'products',
  state: {
    list: ['Product #1', 'Product #2'],
  },
  reducers: {
    add: (state, { payload }) => R.append(payload, state),
  },
})

export default products
