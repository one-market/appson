/* eslint no-use-before-define: 0, react/jsx-no-bind: 0, brace-style: 0 */

import { render } from 'react-dom'
import createHistory from 'history/createBrowserHistory'

import createApp from '../utils/create-app'
import createStore from '../utils/create-store'
import rootSaga from '../utils/sagas/root'

const appson = (Module) => {
  const history = createHistory()
  const store = createStore(Module, history)
  const app = createApp(Module, store, history)

  return {
    render: (el) => {
      store.run(rootSaga, store)
      render(app, document.querySelector(el))
    },
  }
}

export { createApp }
export default appson
