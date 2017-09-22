import * as React from 'react'
import * as Redux from 'redux';
import * as ReduxSaga from 'redux-saga'
import * as ReactRouter from 'react-router'

import { App } from './src/appson'
import BaseState from './src/state'

declare module '@onemarket/appson' {
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

  export function appson(Module: React.ComponentType): App

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
    children: any
  }

  export type WrapperComponent = React.ComponentType<{
    children: any,
    store: AppStore,
  }>

  export class Routes<P extends RoutesProps = RoutesProps> extends React.PureComponent<P> {}
  export class Route<P extends RouteProps = RouteProps> extends React.PureComponent<P> {}
  export class Link<P extends LinkProps = LinkProps> extends React.PureComponent<P> {}

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

  export class State<S> extends BaseState<S> {}

  export type StateParent = State<any> | null
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
    Hocs
  **/

  interface AddReturnFn {
    (resource: React.ComponentType | State<any>): React.ComponentType | State<any>
  }

  export interface AddStateFn<S> {
    (state: State<S>): AddReturnFn
  }

  export interface AddEffectsFn {
    <E extends Effects>(effects: E): AddReturnFn
  }

  interface ConnectPredicateFn {
    (...states: object[]): object
  }

  interface ConnectReturnFn {
    (WrappedComponent: React.ComponentType): React.ComponentType
  }

  export interface ConnectFn {
    (states: string[], mapper?: ConnectPredicateFn): ConnectReturnFn
  }

  export function addState<S>(state: State<S>): AddReturnFn
  export function addEffects<E extends Effects = Effects>(effects: Effects): AddReturnFn

  export function connectProps(states: string[], mapper?: ConnectPredicateFn): ConnectReturnFn
  export function connectHandlers(states: string[], mapper?: ConnectPredicateFn): ConnectReturnFn
}
