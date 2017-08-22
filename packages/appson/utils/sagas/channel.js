import R from 'ramda'
import { eventChannel } from 'redux-saga'
import { stores } from '../stores/appson'

const appsonChannel = () => eventChannel((emitter) => {
  for (const type of R.keys(stores)) {
    const store = stores[type]
    const action = (payload) => ({ type, payload })

    emitter(action(store.getState()))
    store.subscribe(() => emitter(action(store.getState())))
  }

  return () => null
})

export default appsonChannel
