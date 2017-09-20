import { AppStore } from '../../index.d'

import R from 'ramda'
import { Store, Reducer, Middleware, ReducersMapObject } from 'redux'
import { createStore as createReduxStore, applyMiddleware, compose, combineReducers } from 'redux'
import { devToolsEnhancer } from 'redux-devtools-extension'
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga'

export const sagaMiddleware: SagaMiddleware<any> = createSagaMiddleware()

interface CreateStoreFn {
  (middlewares: Middleware[], defaultReducers: ReducersMapObject): AppStore
}

const createStore: CreateStoreFn = (middlewares, defaultReducers) => {
  const root: Reducer<any> = combineReducers(defaultReducers)
  const store: Store<any> = createReduxStore(root, compose(
    applyMiddleware(sagaMiddleware, ...middlewares),
    devToolsEnhancer({})
  ))

  return R.merge(store, { defaultReducers })
}

export default createStore
