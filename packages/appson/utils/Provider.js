import React from 'react'
import { createProvider } from 'react-redux/lib/components/Provider'

import effects from './stores/effects'
import reducers from './stores/reducers'

const Provider = ({ children, store }) => {
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
