import {
  StateParams,
  StateParent,
  StateChildren,
  ActionFn,
  ActionMap,
  Reducer,
  Selector,
  SelectorMap,
  Effects,
} from '../../index.d'

import R from 'ramda'
import reduceReducers from 'reduce-reducers'
import { Dispatch } from 'redux'

import * as invariant from '../utils/invariant'
import createActions from './create-actions'
import createReducer from './create-reducer'
import createTypes from './create-types'
import createSelectors from './create-selectors'
import statesStore from '../stores/states'

const isStr = R.is(String)
const isFn = R.is(Function)

class State {
  public name: string
  public children: StateChildren

  private _initial: any
  private _actions: ActionMap
  private _reducer: Reducer
  private _selectors: SelectorMap
  private _effects: Effects
  private _parent: StateParent

  constructor({ name: stateName, initial = {}, reducers = {}, selectors = {} }: StateParams) {
    invariant.isString('name', stateName)
    invariant.isPlainObject('reducers', reducers)
    invariant.isPlainObject('selectors', selectors)
    invariant.hasAllValuesAsFunction('reducers', reducers)
    invariant.hasAllValuesAsFunction('selectors', selectors)

    const actionTypes = createTypes(stateName, reducers)
    const actions = createActions(actionTypes, reducers)
    const reducer = createReducer(initial, actionTypes, reducers)
    const newSelectors = createSelectors(stateName, initial, selectors)

    this.name = stateName
    this.children = null

    this._initial = initial
    this._actions = actions
    this._reducer = reducer
    this._selectors = newSelectors
    this._effects = {}
    this._parent = null
  }

  // static methods

  static find(path: string | string[]): State {
    const globalState = statesStore.getState()
    const parsedPath = R.join('.', isStr(path) ? [path] : [...path])
    const pathWithChildren: string[] = R.intersperse('children', R.split('.', parsedPath))

    return R.path(pathWithChildren, globalState)
  }

  static exist(path: string | string[]): boolean {
    return !!State.find(path)
  }

  // getter methods

  get effects(): Effects { return this._effects }

  // public methods

  public getInitial(): any { return this._initial }
  public getActions(): ActionMap { return this._actions }
  public getReducer(): Reducer { return this._reducer }
  public getSelectors(): SelectorMap { return this._selectors }

  public getPath(): string[] {
    return this._parent ? R.append(this.name, this._parent.getPath()) : [this.name]
  }

  public setParent(state: State): void {
    this._parent = state
  }

  public addEffects(effects: Effects): void {
    this._effects = R.merge(effects, this._effects)
  }

  public addChild(child: State): void {
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
    const selectors: SelectorMap = this._selectors
    const state: any = R.path(this.getPath(), globalState)

    const reduceSelectors = R.reduce((obj: object, key: string): object => {
      const selector: Selector = R.prop(key, selectors)
      const newSelector = isFn(selector) ? selector(state) : reduceSelectors(R.keys(selector))

      return R.assoc(key, newSelector, obj)
    }, {})

    return reduceSelectors(R.keys(selectors))
  }

  // private methods

  private _updateChildren(child: State): void {
    this.children = R.assoc(child.name, child, this.children)
  }

  private _updateInitial(child: State): void {
    this._initial = R.assoc(child.name, child.getInitial(), this._initial)
  }

  private _updateReducerWithChild(child: State): void {
    const childReducer = child.getReducer()

    this._reducer = reduceReducers(this._reducer, (state, action): any =>
      R.assoc(child.name, childReducer(state[child.name], action), state)
    )
  }
}

export default State
