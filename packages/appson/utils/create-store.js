import R from 'ramda'
import { routerMiddleware } from 'react-router-redux'
import { createStore as createReduxStore, applyMiddleware, compose } from 'redux'
import { devToolsEnhancer } from 'redux-devtools-extension'
import createSagaMiddleware, { END } from 'redux-saga'

const defineProp = (obj) => (prop, value) =>
  Object.defineProperty(obj, prop, { value, writable: false })

const storeWithSaga = (store, sagaMiddleware) => {
  const defineStoreProp = defineProp(store)

  defineStoreProp('run', sagaMiddleware.run)
  defineStoreProp('stop', () => store.dispatch(END))

  return store
}

const createStore = (Module, history) => {
  const sagaMiddleware = createSagaMiddleware()
  const router = routerMiddleware(history)
  const middlewares = applyMiddleware(router, sagaMiddleware)
  const store = createReduxStore(R.F, compose(middlewares, devToolsEnhancer()))

  return storeWithSaga(store, sagaMiddleware)
}

export default createStore
