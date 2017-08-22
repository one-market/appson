import React from 'react'
import { ConnectedRouter } from 'react-router-redux'
import { AppContainer } from 'react-hot-loader'
import { Route } from 'react-router-dom'
import Provider from './Provider'

const createApp = (Module, store, history) => (
  <AppContainer key={Math.random()}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Route path="/" component={Module} />
      </ConnectedRouter>
    </Provider>
  </AppContainer>
)

export default createApp
