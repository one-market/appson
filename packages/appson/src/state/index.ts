import {
  StateParams,
  StateParent,
  StateMap,
  ActionTypes,
  ActionMap,
  Reducer,
  ReducerMap,
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
  private stateName: string
  private initialState: any
  private reducers: ReducerMap

  private actionTypes: ActionTypes
  private actions: ActionMap
  private reducer: Reducer
  private selectors: SelectorMap

  private effects: Effects

  private parent: StateParent
  private children: StateMap

  constructor({ name: stateName, initial = {}, reducers = {}, selectors = {} }: StateParams) {
    invariant.isString('name', stateName)
    invariant.isPlainObject('reducers', reducers)
    invariant.isPlainObject('selectors', selectors)
    invariant.hasAllValuesAsFunction('reducers', reducers)
    invariant.hasAllValuesAsFunction('selectors', selectors)

    this.stateName = stateName
    this.initialState = initial
    this.reducers = reducers

    this.actionTypes = createTypes(stateName, reducers)
    this.actions = createActions(this.actionTypes, reducers)
    this.reducer = createReducer(initial, this.actionTypes, reducers)
    this.selectors = createSelectors(stateName, initial, selectors)

    this.effects = {}

    this.parent = null
    this.children = {}
  }

  public getStateName = (): string => this.stateName
  public getInitialState = (): any => this.initialState
  public getActionTypes = (): ActionTypes => this.actionTypes
  public getReducer = (): Reducer => this.reducer
  public getReducers = (): ReducerMap => this.reducers
  public getActions = (): ActionMap => this.actions
  public getSelectors = (): SelectorMap => this.selectors
  public getEffects = (): Effects => this.effects
  public getParent = (): StateParent => this.parent
  public getChildren = (): StateMap => this.children

  public setParent = (state: State): void => {
    this.parent = state
  }

  public setEffects = (effects: Effects): void => {
    this.effects = R.merge(effects, this.effects)
  }

  public addChildren = (state: State): void => {
    state.setParent(this)
    this.children = R.assoc(state.getStateName(), state, this.children)
  }
}

export default State
