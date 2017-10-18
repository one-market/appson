import * as R from 'ramda'
import reduceReducers from 'reduce-reducers'
import invariant from 'invariant'
import { Action as ReduxAction, Dispatch } from 'redux'
import { SagaIterator } from 'redux-saga'

import deepEqual from '../utils/object/deep-equal'
import * as invariants from '../utils/invariants'

import createActions from './create-actions'
import createReducer from './create-reducer'
import createTypes from './create-types'
import createSelectors from './create-selectors'
import statesStore from '../stores/states'

const isObj = R.is(Object)
const isFn = R.is(Function)

export interface Meta<Data = any> {
  [key: string]: Data
}

export type ActionTypes = string[]

export interface Action<Payload = any> extends ReduxAction {
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

export interface StateMap {
  [stateName: string]: State<any>
}

export type Effect = SagaIterator

export interface Effects {
  [effect: string]: Effect
}

interface Selector<S> extends Computed<S> {}
interface Selectors<S> extends ComputedMap<S> {}

export class State<S> {
  public name: string
  public children: StateMap | null

  private _initial: any
  private _actions: ActionMap
  private _rootReducer: Reducer
  private _selectors: Selectors<S>
  private _effects: Effects
  private _parent: State<any> | null

  constructor({ name: stateName, initial = {}, handlers = {}, computed = null }: StateParams) {
    invariants.isString('name', stateName)
    invariants.isPlainObject('handlers', handlers)
    invariants.isPlainObject('computed', computed || {})
    invariants.hasAllValuesAsFunction('handlers', handlers)
    invariants.hasAllValuesAsFunction('computed', computed || {})

    if (!R.isNil(computed)) {
      invariant(
        isObj(initial),
        `To use computed props the initial value of state "${stateName}" need to be an object`,
      )
    }

    const actionTypes = createTypes(stateName, handlers)
    const actions = createActions(actionTypes, handlers)
    const rootReducer = createReducer(initial, actionTypes, handlers)
    const selectors = createSelectors(stateName, initial, computed)

    this.name = stateName
    this.children = null

    this._initial = initial
    this._actions = actions
    this._rootReducer = rootReducer
    this._selectors = selectors
    this._effects = {}
    this._parent = null
  }

  // static methods

  static find(path: string): State<any> {
    const globalState = statesStore.getState()
    const pathWithChildren: string[] = R.intersperse('children', R.split('.', path))

    return R.path(pathWithChildren, globalState)
  }

  // getter methods

  get effects(): Effects { return this._effects }

  // public methods

  public getInitial(): any { return this._initial }
  public getRootReducer(): Reducer { return this._rootReducer }
  public getActions(): ActionMap { return this._actions }

  public getPath(): string[] {
    return this._parent ? R.append(this.name, this._parent.getPath()) : [this.name]
  }

  public setParent(state: State<any>): void {
    this._parent = state
  }

  public addEffects(effects: Effects): void {
    this._effects = R.merge(effects, this._effects)
  }

  public addChild(child: State<any>): void {
    child.setParent(this)

    this._updateChildren(child)
    this._updateInitial(child)
    this._updateReducerWithChild(child)
  }

  public mapDispatch(dispatch: Dispatch<any>): ActionMap {
    const actions: ActionMap = this._actions

    const reduceActions = R.reduce((obj: object, key: string): object => {
      const action: ActionFn = R.prop(key, actions)
      return R.assoc(key, (...args: any[]) => dispatch(action(...args)), obj)
    }, {})

    return reduceActions(R.keys(actions))
  }

  public mapProps(globalState: any): any {
    const selectors: Selectors<S> = this._selectors
    const state: any = R.path(this.getPath(), globalState)

    const reduceSelectors = R.reduce((obj: object, key: string): object => {
      const selector: Selector<S> = R.prop(key, selectors)
      const newSelector = isFn(selector) ? selector(state) : reduceSelectors(R.keys(selector))

      return R.assoc(key, newSelector, obj)
    }, {})

    return reduceSelectors(R.keys(selectors))
  }

  public hasChanges(oldState: any, newState: any): boolean {
    const path = this.getPath()
    const omitChildren = R.omit(R.keys(this.children))
    const oldValue = omitChildren(R.path(path, oldState))
    const newValue = omitChildren(R.path(path, newState))

    return R.not(deepEqual(oldValue, newValue))
  }

  // private methods

  private _updateChildren(child: State<any>): void {
    this.children = R.assoc(child.name, child, this.children)
  }

  private _updateInitial(child: State<any>): void {
    this._initial = R.assoc(child.name, child.getInitial(), this._initial)
  }

  private _updateReducerWithChild(child: State<any>): void {
    const childReducer: Reducer = child.getRootReducer()

    this._rootReducer = reduceReducers(this._rootReducer, (state: any, action: Action): any =>
      R.assoc(child.name, childReducer(R.prop(child.name, state), action), state),
    )
  }
}

export default State
