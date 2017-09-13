/* eslint no-use-before-define: 0, react/jsx-no-bind: 0, brace-style: 0 */

import { App } from '../index.d'

import { ComponentType } from 'react'
import { Store } from 'redux'
import { History } from 'history'
import { render } from 'react-dom'
import createHistory from 'history/createBrowserHistory'

import createStore, { sagaMiddleware } from './utils/create-store'
import createApp from './utils/create-app'
import rootSaga from './sagas/root'

const appson = (Module: ComponentType): App => {
  const history: History = createHistory()
  const store: Store<any> = createStore(history)
  const app: JSX.Element = createApp({ Module, store, history })

  return {
    render: (el: string) => {
      sagaMiddleware.run(rootSaga, store)
      render(app, document.querySelector(el))
    },
  }
}

export { createApp }
export default appson
