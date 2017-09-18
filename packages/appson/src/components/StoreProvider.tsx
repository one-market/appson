import { AppStore, ReduxStore } from '../../index.d'

import R from 'ramda'
import t from 'prop-types'
import React, { PureComponent } from 'react'
import { createProvider, ProviderProps } from 'react-redux'

type Props = {
  stores: {
    [key: string]: AppStore | ReduxStore,
  },
}

type Context = {
  [key: string]: AppStore | ReduxStore
}

class StoreProvider extends PureComponent<Props, {}> {
  context: Context

  static contextTypes = {

  }
}

export default StoreProvider
