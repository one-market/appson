import { WrapperComponent, AppStore } from '../../index.d'

import React, { ComponentType } from 'react'
import { History } from 'history'
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router-dom'
import { AppContainer as ReactHotLoader } from 'react-hot-loader'

import createProvider from './create-provider'
import effects from '../stores/effects'
import states from '../stores/states'

interface CreateAppFn {
  (Wrapper: WrapperComponent, Module: ComponentType, store: AppStore, history: History): JSX.Element
}

const createApp: CreateAppFn = (Wrapper, Module, store, history) => {
  const Provider: ComponentType = createProvider({ store, states, effects })

  return (
    <ReactHotLoader key={Math.random()}>
      <Wrapper store={store}>
        <Provider>
          <ConnectedRouter history={history}>
            <Route path="/" component={Module} />
          </ConnectedRouter>
        </Provider>
      </Wrapper>
    </ReactHotLoader>
  )
}

export default createApp
