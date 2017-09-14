import { Store, ReducerMap } from '../../index.d'
import { combineReducers } from 'redux'

type ReducersParams = {
  store: Store,
  reducers: ReducerMap<any>,
}

const reducersSaga = ({ store, reducers }: ReducersParams): void =>
  store.replaceReducer(combineReducers(reducers))

export default reducersSaga
