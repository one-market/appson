import * as R from 'ramda'
import { devToolsEnhancer } from 'redux-devtools-extension'
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga'
import {
  Store,
  Middleware,
  Reducer,
  ReducersMapObject,
  combineReducers,
  createStore as createReduxStore,
  compose,
  applyMiddleware,
} from 'redux'

import { AppStore } from '../appson'

export const sagaMiddleware: SagaMiddleware<any> = createSagaMiddleware()

export interface CreateStoreFn {
  (middlewares: Middleware[], defaultReducers: ReducersMapObject): AppStore
}

const createStore: CreateStoreFn = (middlewares, defaultReducers) => {
  const root: Reducer<any> = combineReducers(defaultReducers)
  const store: Store<any> = createReduxStore(root, compose(
    applyMiddleware(sagaMiddleware, ...middlewares),
    devToolsEnhancer({}),
  ))

  return R.merge(store, { defaultReducers })
}

export default createStore
