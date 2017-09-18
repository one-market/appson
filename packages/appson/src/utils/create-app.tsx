import { AppStore } from '../../index.d'

import React, { ComponentType } from 'react'
import { History } from 'history'
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router-dom'

import createProvider from './create-provider'
import effects from '../stores/effects'
import states from '../stores/states'

interface CreateAppFn {
  (Module: ComponentType, store: AppStore, history: History): JSX.Element
}

const createApp: CreateAppFn = (Module, store, history) => {
  const Provider: ComponentType = createProvider({ store, states, effects })

  return (
    <Provider>
      <ConnectedRouter history={history}>
        <Route path="/" component={Module} />
      </ConnectedRouter>
    </Provider>
  )
}

export default createApp
