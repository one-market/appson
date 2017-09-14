import {
  StateParams,
  ActionTypes,
  Action as BaseAction,
  Reducer as BaseReducer,
  Effects,
  ActionMap,
  SelectorMap,
  ReducerMap,
} from '../../index.d'

import R from 'ramda'

import * as invariant from '../utils/invariant'
import createActions from './create-actions'
import createReducer from './create-reducer'
import createTypes from './create-types'
import createSelectors from './create-selectors'

type Action = BaseAction<any, any>
type Reducer = BaseReducer<any, Action>

class State {
  private stateName: string
  private initialState: any
  private actionTypes: ActionTypes
  private actions: ActionMap
  private reducer: Reducer
  private reducers: ReducerMap<any>
  private selectors: SelectorMap<any>
  private effects: Effects

  private connectedProps: SelectorMap<any>
  private connectedReducers: SelectorMap<any>

  constructor({ name: stateName, initial = {}, reducers = {}, selectors = {} }: StateParams<any>) {
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

    this.connectedProps = this.selectors
    this.connectedReducers = this.reducers
  }

  public getStateName = (): string => this.stateName
  public getInitialState = (): any => this.initialState
  public getActionTypes = (): ActionTypes => this.actionTypes
  public getReducer = (): Reducer => this.reducer
  public getReducers = (): ReducerMap<any> => this.reducers
  public getActions = (): ActionMap => this.actions
  public getSelectors = (): SelectorMap<any> => this.selectors
  public getEffects = (): Effects => this.effects
  public getConnectedProps = (): SelectorMap<any> => this.connectedProps
  public getConnectedReducers = (): ReducerMap<any> => this.connectedReducers

  public setEffects = (effects: Effects): void => {
    this.effects = R.merge(effects, this.effects)
  }

  public setConnectedProps = (selectors: SelectorMap<any>) => {
    this.connectedProps = selectors
  }

  public setConnectedReducers = (reducers: ReducerMap<any>) => {
    this.connectedReducers = reducers
  }
}

export default State
