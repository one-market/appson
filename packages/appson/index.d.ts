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

export interface Meta<Data = any> {
  [key: string]: Data
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

export interface Handler<State = any> {
  <A extends Action>(state: State, action: A): State
}

export interface Reducer<State = any> extends Handler<State> {}

export interface HandlerMap<State = any> {
  [reducerName: string]: Handler<State>
}

export interface Computed<State = any, Props = any, PropValue = any> {
  (state: State, props?: Props): PropValue
}

export interface ComputedMap<State = any> {
  [selectorName: string]: Computed<State>
}

export interface StateParams {
  name: string
  initial?: any
  computed?: ComputedMap
  handlers?: HandlerMap
}

export type StateParent<S = any> = State<S> | null
export type StateChildren = StateMap | null

export interface StateMap {
  [stateName: string]: State<any>
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

interface AddReturnedFn {
  (resource: React.ComponentType | State<any>): React.ComponentType | State<any>
}

export interface AddStateFn<S> {
  (state: State<S>): AddReturnedFn
}

export interface AddEffectsFn {
  <E extends Effects>(effects: E): AddReturnedFn
}

export declare function addState<S>(state: State<S>): AddReturnedFn
export declare function addEffects<E extends Effects>(effects: E): AddReturnedFn

export interface ConnectPredicateFn {
  (...states: object[]): object
}

export interface ConnectFn {
  (states: string[], mapper?: ConnectPredicateFn):
    (WrappedComponent: React.ComponentType) => React.ComponentType
}

export function connect(states: string[], predicate: ConnectPredicateFn): React.ComponentType
