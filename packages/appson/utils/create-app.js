import React from 'react'
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router-dom'
import Provider from './Provider'

const createApp = (Module, store, history) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path="/" component={Module} />
    </ConnectedRouter>
  </Provider>
)

export default createApp
