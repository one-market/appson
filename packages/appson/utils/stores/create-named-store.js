import R from 'ramda'
import { createStore } from 'redux'

const createNamedStore = (name, ...storeProps) =>
  R.assoc('name', name, createStore(...storeProps))

export default createNamedStore
