import { ComponentType } from 'react'
import { ProviderProps } from 'react-redux'

declare module 'react-redux' {
  function createProvider(storeKey: string, subKey?: string): ComponentType<ProviderProps>
}
