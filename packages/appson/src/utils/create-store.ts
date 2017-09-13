import R from 'ramda'
import { Store, GenericStoreEnhancer } from 'redux'
import { Middleware } from 'redux'
import { History } from 'history'
import { routerMiddleware } from 'react-router-redux'
import { createStore as createReduxStore, applyMiddleware, compose } from 'redux'
import { devToolsEnhancer } from 'redux-devtools-extension'
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga'

export const sagaMiddleware: SagaMiddleware<any> = createSagaMiddleware()

const createStore = (history: History): Store<any> => {
  const router: Middleware = routerMiddleware(history)
  const middlewares: GenericStoreEnhancer = applyMiddleware(router, sagaMiddleware)
  const enhance = compose(middlewares, devToolsEnhancer({}))

  return createReduxStore(R.F, enhance)
}

export default createStore
