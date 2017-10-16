/* eslint no-use-before-define: 0, react/jsx-no-bind: 0, brace-style: 0 */

import * as R from 'ramda'
import { ComponentType } from 'react'
import { ReducersMapObject, Middleware, Store } from 'redux'
import { History } from 'history'
import { render } from 'react-dom'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { END } from 'redux-saga'
import createHistory from 'history/createBrowserHistory'

import createStore, { sagaMiddleware } from './utils/create-store'
import createApp from './utils/create-app'
import rootSaga from './sagas/root'

export interface InternalStore extends Store<any> {
  name: string
}

export interface AppStore extends Store<any> {
  defaultReducers: ReducersMapObject
}

export type WrapperProps = {
  children: any,
  store?: AppStore,
}

export type WrapperComponent = React.ComponentType<WrapperProps>

export class App {
  private wrappers: WrapperComponent[]
  private RootModule: ComponentType
  private history: History
  private middlewares: Middleware[]
  private defaultReducers: ReducersMapObject
  private store: AppStore
  private rootEl: string

  constructor(Module: ComponentType) {
    this.RootModule = Module
    this.history = createHistory()
    this.wrappers = []

    this.middlewares = [
      routerMiddleware(this.history),
    ]

    this.defaultReducers = {
      router: routerReducer,
    }

    this.store = createStore(
      this.middlewares,
      this.defaultReducers,
    )
  }

  public addMiddleware(middleware: Middleware): App {
    this.middlewares = R.append(middleware, this.middlewares)
    return this
  }

  public addReducer(reducer: ReducersMapObject): App {
    this.defaultReducers = R.merge(reducer, this.defaultReducers)
    return this
  }

  public wrapper(Component: WrapperComponent): App {
    Component.displayName = Component.displayName || Component.name || 'AppsonWrapper'
    this.wrappers.push(Component)

    return this
  }

  public render(el: string): void {
    const { RootModule, wrappers, history, store } = this
    const app: JSX.Element = createApp(RootModule, wrappers, store, history)

    this.rootEl = el

    store.dispatch(END)
    sagaMiddleware.run(rootSaga, this.store)
    render(app, document.querySelector(el))
  }

  public updateRootModule(NewModule: ComponentType) {
    this.RootModule = NewModule
    this.render(this.rootEl)

    return this
  }
}

const appson = (Module: ComponentType): App => new App(Module)

export default appson
