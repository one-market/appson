import React, { ComponentType } from 'react'
import { History } from 'history'
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router-dom'

import { WrapperComponent as WC, WrapperProps, AppStore } from '../appson'
import createProvider from './create-provider'
import effects from '../stores/effects'
import states from '../stores/states'

export interface RecursiveWrappersFn {
  (wrappers: WC[], props: WrapperProps): JSX.Element
}

const recursiveWrappers: RecursiveWrappersFn = ([Wrapper, ...rest], props) => (
  <Wrapper {...props}>
    {rest.length ? recursiveWrappers(rest, props) : props.children}
  </Wrapper>
)

export interface CreateAppFn {
  (Module: ComponentType, wrappers: WC[], store: AppStore, history: History): JSX.Element
}

const createApp: CreateAppFn = (Module, wrappers, store, history) => {
  const StoreProvider = createProvider('store')
  const StatesProvider = createProvider('states')
  const EffectsProvider = createProvider('effects')

  const Wrapper: WC = (props) =>
    wrappers.length ? recursiveWrappers(wrappers, props) : props.children

  return (
    <Wrapper store={store}>
      <StatesProvider store={states}>
        <EffectsProvider store={effects}>
          <StoreProvider store={store}>
            <ConnectedRouter history={history}>
              <div>
                <Route path="/" component={Module} />
              </div>
            </ConnectedRouter>
          </StoreProvider>
        </EffectsProvider>
      </StatesProvider>
    </Wrapper>
  )
}

export default createApp
