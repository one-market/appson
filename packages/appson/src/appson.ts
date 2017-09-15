/* eslint no-use-before-define: 0, react/jsx-no-bind: 0, brace-style: 0 */

import { AppStore } from '../index.d'

import R from 'ramda'
import { ComponentType } from 'react'
import { ReducersMapObject, Middleware } from 'redux'
import { History } from 'history'
import { render } from 'react-dom'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import createStore, { sagaMiddleware } from './utils/create-store'
import createApp from './utils/create-app'
import rootSaga from './sagas/root'

export class App {
  private RootModule: ComponentType
  private history: History
  private middlewares: Middleware[]
  private defaultReducers: ReducersMapObject

  constructor(Module: ComponentType) {
    this.RootModule = Module
    this.history = createHistory()

    this.middlewares = [
      routerMiddleware(this.history)
    ]

    this.defaultReducers = {
      router: routerReducer
    }
  }

  public addMiddleware(middleware: Middleware): App {
    this.middlewares = R.append(middleware, this.middlewares)
    return this
  }

  public addReducer(reducer: ReducersMapObject): App {
    this.defaultReducers = R.merge(reducer, this.defaultReducers)
    return this
  }

  public render(el: string): void {
    const store: AppStore = createStore(this.middlewares, this.defaultReducers)
    const app: JSX.Element = createApp(this.RootModule, store, this.history)

    sagaMiddleware.run(rootSaga, store)
    render(app, document.querySelector(el))
  }
}

const appson = (Module: ComponentType): App => new App(Module)

export default appson
