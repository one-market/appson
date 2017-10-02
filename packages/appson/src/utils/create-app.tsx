import { WrapperComponent as WC, WrapperProps, AppStore } from '../../index.d'

import R from 'ramda'
import React, { ComponentType } from 'react'
import { History } from 'history'
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router-dom'
import { AppContainer as ReactHotLoader } from 'react-hot-loader'

import createProvider from './create-provider'
import effects from '../stores/effects'
import states from '../stores/states'

interface RecursiveWrappersFn {
  (wrappers: WC[], props: WrapperProps): JSX.Element
}

interface CreateAppFn {
  (Module: ComponentType, wrappers: WC[], store: AppStore, history: History): JSX.Element
}

const recursiveWrappers: RecursiveWrappersFn = ([Wrapper, ...rest], props) => (
  <Wrapper {...props}>
    {rest.length ? recursiveWrappers(rest, props) : props.children}
  </Wrapper>
)

const createApp: CreateAppFn = (Module, wrappers, store, history) => {
  const Provider: ComponentType = createProvider({ store, states, effects })

  const Wrapper: WC = (props) =>
    wrappers.length ? recursiveWrappers(wrappers, props) : props.children

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
