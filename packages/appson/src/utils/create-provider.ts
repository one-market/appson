import { AppStore, InternalStore } from '../../index.d'

import R from 'ramda'
import t from 'prop-types'
import { Children, ComponentType, PureComponent } from 'react'

type StoreMap = {
  [key: string]: AppStore | InternalStore,
}

type ChildContext = {
  [key: string]: AppStore | InternalStore,
}

const createProvider = (storeMap: StoreMap): ComponentType =>
  class Provider extends PureComponent<{}> {
    childContext: ChildContext

    static childContextTypes = R.mapObjIndexed(() => t.object, storeMap)

    getChildContext = () => storeMap

    render() {
      return Children.only(this.props.children)
    }
  }

export default createProvider
