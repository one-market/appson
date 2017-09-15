import React from 'react'
import { createProvider, ProviderProps } from 'react-redux'

import effects from '../stores/effects'
import states from '../stores/states'

const Provider = ({ children, store }: ProviderProps): JSX.Element => {
  const Redux = createProvider('store')
  const States = createProvider('states')
  const Effects = createProvider('effects')

  return (
    <States store={states}>
      <Effects store={effects}>
        <Redux store={store}>
          {children}
        </Redux>
      </Effects>
    </States>
  )
}

export default Provider
