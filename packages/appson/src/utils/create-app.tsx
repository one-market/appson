import { AppStore } from '../../index.d'

import React, { ComponentType } from 'react'
import { History } from 'history'
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router-dom'

import Provider from './Provider'

interface CreateAppFn {
  (Module: ComponentType, store: AppStore, history: History): JSX.Element
}

const createApp: CreateAppFn = (Module, store, history) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path="/" component={Module} />
    </ConnectedRouter>
  </Provider>
)

export default createApp
