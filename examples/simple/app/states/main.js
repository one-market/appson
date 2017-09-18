import R from 'ramda'
import { State } from 'appson'

export default new State({
  name: 'main',
  initial: {
    title: 'Appson',
  },
  handlers: {
    setTitle: (state, { payload }) =>
      R.evolve({ text: R.always(payload) }, state),
  },
})
