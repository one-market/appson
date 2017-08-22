import R from 'ramda'
import { routerMiddleware } from 'react-router-redux'
import { createStore as createReduxStore, applyMiddleware, compose } from 'redux'
import { devToolsEnhancer } from 'redux-devtools-extension'
import createSagaMiddleware, { END } from 'redux-saga'

const createStore = (Module, history) => {
  const sagaMiddleware = createSagaMiddleware()
  const router = routerMiddleware(history)
  const middlewares = applyMiddleware(router, sagaMiddleware)
  const store = createReduxStore(R.F, compose(middlewares, devToolsEnhancer()))

  const addSagaMethods = R.pipe(
    R.assoc('run', sagaMiddleware.run),
    R.assoc('stop', () => store.dispatch(END)),
  )

  return addSagaMethods(store)
}

export default createStore
