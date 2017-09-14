import R from 'ramda'
import { State } from 'appson'
import { v4 } from 'uuid'

const products = new State({
  name: 'products',
  initial: {
    list: [
      { id: v4(), name: 'Product #1' },
      { id: v4(), name: 'Product #2' },
    ],
  },
  reducers: {
    add: (state, { payload }) =>
      R.evolve({ list: R.append(payload) }, state),
  },
})

export default products
