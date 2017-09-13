import React, { ComponentType } from 'react'
import { Store } from 'redux'
import { History } from 'history'
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router-dom'
import Provider from './Provider'

type Props = {
  Module: ComponentType,
  store: Store<any>,
  history: History,
}

const createApp = ({ Module, store, history }: Props): JSX.Element => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path="/" component={Module} />
    </ConnectedRouter>
  </Provider>
)

export default createApp
