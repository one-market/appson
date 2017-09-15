import {
  StateParams,
  StateParent,
  StateChildren,
  ActionMap,
  Reducer,
  SelectorMap,
  Effects,
} from '../../index.d'

import R from 'ramda'

import * as invariant from '../utils/invariant'
import createActions from './create-actions'
import createReducer from './create-reducer'
import createTypes from './create-types'
import createSelectors from './create-selectors'

class State {
  private _name: string
  private _actions: ActionMap
  private _reducer: Reducer
  private _selectors: SelectorMap
  private _effects: Effects
  private _parent: StateParent
  private _children: StateChildren

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

    this._name = stateName
    this._actions = actions
    this._reducer = reducer
    this._selectors = newSelectors
    this._effects = {}
    this._parent = null
    this._children = null
  }

  public getName = (): string => this._name
  public getActions = (): ActionMap => this._actions
  public getReducer = (): Reducer => this._reducer
  public getSelectors = (): SelectorMap => this._selectors
  public getEffects = (): Effects => this._effects

  public setParent = (state: State): void => {
    this._parent = state
  }

  public addEffects = (effects: Effects): void => {
    this._effects = R.merge(effects, this._effects)
  }

  public addChildren = (state: State): void => {
    this._children = R.assoc(state.getName(), state, this._children)
    state.setParent(this)
  }
}

export default State
