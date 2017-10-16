import t from 'prop-types'
import { Children, ComponentType, PureComponent } from 'react'
import { AppStore, InternalStore } from '../appson'

type ProviderProps = {
  store: AppStore | InternalStore,
}

type ChildContext = {
  [key: string]: any,
}

export const createProvider = (storeKey: string = 'store'): ComponentType<ProviderProps> => {
  class Provider extends PureComponent<ProviderProps> {
    static childContextTypes: ChildContext = {
      [storeKey]: t.object.isRequired,
    }

    getChildContext() {
      return {
        [storeKey]: this.props.store,
      }
    }

    render() {
      return Children.only(this.props.children)
    }
  }

  return Provider
}

export default createProvider
