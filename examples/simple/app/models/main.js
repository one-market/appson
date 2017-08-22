import R from 'ramda'
import { model } from 'appson'

export default model({
  name: 'main',
  state: {
    title: 'Appson',
  },
  reducers: {
    setTitle(state, { payload }) {
      return R.evolve({ text: R.always(payload) }, state)
    },
  },
})
