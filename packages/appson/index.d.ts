import * as Redux from 'redux';
import * as ReduxSaga from 'redux-saga'
import * as ReactRouter from 'react-router'

import State from './src/state'

/*
  Components
**/

type LocationObject = {
  pathname?: string
  search?: string
  state?: any
  hash?: string
  key?: string
}

export interface IsActiveFn {
  (match: ReactRouter.match<any>, location: LocationObject): boolean
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
  to: string
  location?: LocationObject,
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

export interface Meta {
  [key: string]: any
}

export type ActionTypes = string[]

export interface Action<Payload = any> extends Redux.Action {
  payload?: Payload
  meta?: Meta
}

export interface ActionFn<Payload = any> {
  <A extends Action>(payload?: Payload, meta?: any): A
}

export interface ActionMap {
  [actionName: string]: ActionFn
}

export interface Reducer<State = any> {
  <A extends Action>(state: State, action: A): State
}

export interface ReducerMap {
  [reducerName: string]: Reducer
}

export interface Selector<State = any, Props = any, PropValue = any> {
  (state: State, props?: Props): PropValue
}

export interface SelectorMap {
  [selectorName: string]: Selector
}

export interface StateParams {
  name: string
  initial?: any
  reducers?: ReducerMap
  selectors?: SelectorMap
}

export type StateParent = State | null

export interface StateMap {
  [stateName: string]: State
}

/*
  Effects
**/

export type Effect = ReduxSaga.SagaIterator

export interface Effects {
  [effect: string]: Effect
}

/*
  Internal
**/

export type StoresChannelAction = {
  storeName: string,
  state: any,
}

export type StoresChannel = ReduxSaga.Channel<StoresChannelAction>

export interface InternalStore extends Redux.Store<any> {
  name: string
}

export interface AppStore extends Redux.Store<any> {
  defaultReducers: Redux.ReducersMapObject
}

/*
  Hocs
**/

type AddReturnedFn = (resource: React.ComponentType | State) => React.ComponentType | State

export type AddStateFn = (state: State) => AddReturnedFn
export type AddEffectsFn = (effects: Effects) => AddReturnedFn

export declare function addState(state: State): AddReturnedFn
export declare function addEffects(effects: Effects): AddReturnedFn

export interface ConnectPredicateFn {
  (...states: object[]): object
}

export interface ConnectFn {
  (states: string[], predicate: ConnectPredicateFn): (WrappedComponent: React.ComponentType) => React.ComponentType
}

export function connect(states: string[], predicate: ConnectPredicateFn): React.ComponentType
