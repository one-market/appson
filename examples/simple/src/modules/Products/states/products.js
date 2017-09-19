import R from 'ramda'
import { State } from '@appson/react'
import { v4 } from 'uuid'

const products = new State({
  name: 'products',
  initial: {
    list: [
      { id: v4(), name: 'Product #1' },
      { id: v4(), name: 'Product #2' },
      { id: v4(), name: 'Product #3' },
      { id: v4(), name: 'Product #4' },
      { id: v4(), name: 'Product #5' },
    ],
  },
  computed: {
    quantity: (state) => state.list.length,
  },
  handlers: {
    add: (state, { payload }) =>
      R.evolve({ list: R.append(payload) }, state),
  },
})

export default products
