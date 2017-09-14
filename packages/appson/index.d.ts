import * as Redux from 'redux';
import * as ReduxSaga from 'redux-saga'
import * as ReactRouter from 'react-router'
import * as History from 'history'

import State from './src/state'

/*
  Internal
**/

export type ChannelAction = {
  type: string,
  payload: any,
}

export type Channel = ReduxSaga.Channel<ChannelAction>

export interface Store extends Redux.Store<any> {
  name: string
}

/*
  Components
**/

export interface IsActiveFn {
  (match: ReactRouter.match<any>, location: History.LocationDescriptorObject): boolean
}

export interface LinkProps {
  replace?: boolean
  relative?: boolean
  exact?: boolean,
  strict?: boolean,
  activeClassName?: string,
  className?: string,
  activeStyle?: object,
  style?: object,
  to: string | History.LocationDescriptorObject
  location?: History.LocationDescriptorObject,
  isActive?: IsActiveFn,
  ariaCurrent?: 'page' | 'step' | 'location' | 'true'
}

export interface RouteProps extends ReactRouter.RouteProps {
  basePath?: string | null,
}

export interface RoutesProps {
  children: React.ReactChild
}

/*
  State
**/

export type ActionTypes = string[]

export interface ActionFn<Action, Payload, Meta> {
  (payload?: Payload, meta?: Meta): Action
}

export interface BaseAction<Payload> extends Redux.Action {
  payload?: Payload
}

export interface Action<Payload, Meta> extends BaseAction<Payload> {
  meta?: Meta
}

export interface Reducer<States, Action> {
  (state: States, action: Action): States
}

export interface Selector<States, Props, Return> {
  (state: States, props?: Props): Return
}

interface Map<Type> {
  [key: string]: Type
}

export interface ActionMap extends Map<ActionFn<Action<any, any>, any, any>> {}
export interface ReducerMap<States> extends Map<Reducer<States, any>> {}
export interface SelectorMap<States> extends Map<Selector<States, any, any>> {}

export interface StateParams<States> {
  name: string
  initial?: any
  reducers?: ReducerMap<States>
  selectors?: SelectorMap<States>
}

export interface StateMap extends Map<State> {}

/*
  Effects
**/

export type Effect = ReduxSaga.SagaIterator

export interface Effects {
  [effect: string]: Effect
}

export interface App {
  render: (el: string) => void
}
