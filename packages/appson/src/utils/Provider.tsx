import React from 'react'
import { createProvider, ProviderProps } from 'react-redux'

import effects from '../stores/effects'
import reducers from '../stores/reducers'

const Provider = ({ children, store }: ProviderProps): JSX.Element => {
  const Redux = createProvider('store')
  const Reducers = createProvider('reducers')
  const Effects = createProvider('effects')

  return (
    <Reducers store={reducers}>
      <Effects store={effects}>
        <Redux store={store}>
          {children}
        </Redux>
      </Effects>
    </Reducers>
  )
}

export default Provider
