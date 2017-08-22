import React from 'react'
import { createProvider } from 'react-redux/lib/components/Provider'
import { stores } from './stores/appson'

const Provider = ({ children, store }) => {
  const Redux = createProvider('store')
  const Reducers = createProvider('reducers')
  const Effects = createProvider('effects')

  return (
    <Redux store={store}>
      <Reducers store={stores.reducers}>
        <Effects store={stores.effects}>
          {children}
        </Effects>
      </Reducers>
    </Redux>
  )
}

export default Provider
