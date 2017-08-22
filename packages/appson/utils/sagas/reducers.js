import { combineReducers } from 'redux'

const reducersSaga = ({ store, reducers }) =>
  store.replaceReducer(combineReducers(reducers))

export default reducersSaga
