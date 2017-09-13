import * as Redux from 'redux';
import * as ReduxSaga from 'redux-saga'
import * as ReactRouter from 'react-router'
import * as ReduxActions from 'redux-actions'

export type ChannelAction = {
  type: string,
  payload: any,
}

export interface Channel extends ReduxSaga.Channel<ChannelAction> {}

export interface Store extends Redux.Store<any> {
  name: string
}

export interface LinkProps {
  relative: boolean
  to: string
}

export interface RouteProps extends ReactRouter.RouteProps {
  basePath?: string | null,
}

export interface RoutesProps {
  children: React.ReactChild
}

export type Effect = ReduxSaga.SagaIterator
export interface Effects { [effect: string]: Effect }

export interface Action<P> extends Redux.Action {
  payload: P
}

export type StateTypes = string[]
export interface StateAction<P> extends ReduxActions.Action<P> { meta?: object }
export interface StateActionMap<P> {
  [actionName: string]: ReduxActions.ActionFunctionAny<StateAction<P>>
}

export type StateReducer<S, P> = (state: S, action: StateAction<P>) => S
export interface StateReducerMap<S, P> { [actionType: string]: StateReducer<S, P> }

export type StateSelector<S, P> = (state: S, props?: P) => any
export interface StateSelectorMap<S, P> { [key: string]: StateSelector<S, P> }

export interface State<S, P1, P2> {
  name: string
  initial?: any
  reducers?: StateReducerMap<S, P1>
  selectors?: StateSelectorMap<S, P2>
}

export interface StateAsReducer extends StateReducer<any, any> {
  stateName: string
  actions: StateActionMap<any>
  selectors: StateSelectorMap<any, any>
  effects?: Effects
}

export interface StateMap { [stateName: string]: State<any, any, any> }

export interface App {
  render: (el: string) => void
}
