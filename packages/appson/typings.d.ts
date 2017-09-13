import { ProviderProps } from 'react-redux'
import { ActionFunctionAny, Action } from 'redux-actions'

declare module 'react-redux' {
  function createProvider(storeKey: string, subKey?: string): React.ComponentType<ProviderProps>
}
