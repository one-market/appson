import React from 'react'
import { createProvider } from 'react-redux/lib/components/Provider'
import appson from './stores/appson'

const Provider = ({ children, store }) => {
  const Redux = createProvider('store')
  const Appson = createProvider('appson')

  return (
    <Appson store={appson}>
      <Redux store={store}>
        {children}
      </Redux>
    </Appson>
  )
}

export default Provider
