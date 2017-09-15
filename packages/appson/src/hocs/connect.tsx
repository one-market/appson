import {
  ActionFn,
  ActionMap,
  Selector,
  SelectorMap,
  StateMap,
  ConnectFn,
  AppStore,
} from '../../index.d'

import t from 'prop-types'
import R from 'ramda'
import React, { PureComponent } from 'react'
import { Dispatch } from 'redux'

import statesStore from '../stores/states'
import State from '../state'

type Selectors = SelectorMap | Selector

const isFunc = R.is(Function)
const reduceIndexed = R.addIndex(R.reduce)

const selectorsMap = (globalState: any, selectors: Selectors): Selectors =>
  reduceIndexed((obj: object, key: string, idx: number): object => {
    const selector: Selector = R.nth(idx, R.values(selectors))
    const newSelector: Selectors = isFunc(selector) ?
      selector(globalState) :
      selectorsMap(globalState, selector)

    return R.assoc(key, newSelector, obj)
  }, {}, R.keys(selectors))

const actionsMap = (dispatch: Dispatch<any>, actions: ActionMap): ActionMap =>
  reduceIndexed((obj: object, key: string, idx: number): object => {
    const action: ActionFn = R.nth(idx, R.values(actions))

    return R.assoc(key, (...args: any[]) => dispatch(action(...args)), obj)
  }, {}, R.keys(actions))

const argsFromStates = (store: AppStore, states: StateMap): object[] =>
  R.map((state: State): object => ({
    ...selectorsMap(store.getState(), state.getSelectors()),
    ...actionsMap(store.dispatch, state.getActions()),
  }), R.values(states))

type Context = {
  store: AppStore,
}

interface Subscriber {
  (): void
}

type ConnectState = {
  subscriber: Subscriber,
  props: object,
}

const connect: ConnectFn = (states, predicate) => (WrappedComponent) =>
  class Connect extends PureComponent<{}, ConnectState> {
    context: Context

    static contextTypes = {
      store: t.object,
    }

    state = {
      subscriber: () => null,
      props: {}
    }

    updateProps = (): void => {
      const { store } = this.context
      const stateMap: StateMap = R.pick(states, statesStore.getState())
      const args: object[] = argsFromStates(store, stateMap)

      args.length && this.setState({ props: predicate(...args) })
    }

    checkStatesInNewStates = (newState: any): boolean =>
      R.any((key: string) => R.contains(key, states), R.keys(newState))

    subscribeStates = (): void => {
      const { store } = this.context
      let prevState: any = store.getState()

      const subscriber: Subscriber = store.subscribe((): void => {
        const newState: any = store.getState()
        const hasStatesInNewStates: boolean = this.checkStatesInNewStates(newState)

        if (hasStatesInNewStates) {
          for (const state of states) {
            if (R.not(R.equals(prevState[state], newState[state]))) {
              this.updateProps()
            }
          }

          prevState = newState
        }
      })

      this.setState({ subscriber })
    }

    componentWillMount() {
      this.updateProps()
    }

    componentDidMount() {
      this.subscribeStates()
    }

    componentWillUnmount() {
      this.state.subscriber()
    }

    render(): JSX.Element {
      return (
        <WrappedComponent {...this.props} {...this.state.props} />
      )
    }
  }

export default connect
