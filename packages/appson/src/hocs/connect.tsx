import { ActionMap, ConnectFn, AppStore } from '../../index.d'

import t from 'prop-types'
import R from 'ramda'
import React, { PureComponent } from 'react'
import { Dispatch } from 'redux'
import deepEqual from 'fast-deep-equal'

import State from '../state'

type Context = {
  store: AppStore,
}

type ConnectState = {
  props: object,
  args: object,
}


const reduceIndexed = R.addIndex(R.reduce)

const connect: ConnectFn = (states, predicate) => (WrappedComponent) => {
  let unsubscribe: () => void;

  return class Connect extends PureComponent<{}, ConnectState> {
    context: Context

    static contextTypes = {
      store: t.object,
    }

    state = {
      args: {},
      props: {},
    }

    updateProps = (args: object): void =>
      this.setState({ props: predicate(...R.values(args)) })

    stateObject = (globalState: any, dispatch: Dispatch<any>) =>
      (obj: object, path: string, idx: number): object => {
        if (!State.exist(path)) return obj

        const state: State = State.find(path)
        const actions: ActionMap = state.mapDispatch(dispatch)
        const props: any = state.mapProps(globalState)

        return R.assoc(idx.toString(), { ...actions, ...props }, obj)
    }

    updateArgs = (globalState: any, dispatch: Dispatch<any>): void => {
      const { args } = this.state

      const reducePredicate = this.stateObject(globalState, dispatch)
      const newArgs: object = reduceIndexed(reducePredicate, args, states)
      const hasArgs: boolean = R.not(R.isNil(newArgs))
      const hasChanges: boolean = R.not(deepEqual(args, newArgs))

      if (hasArgs && hasChanges) {
        this.setState({ args: newArgs })
        this.updateProps(newArgs)
      }

      if (hasArgs && !hasChanges) {
        this.updateProps(args)
      }
    }

    checkStatesChange = (oldState: any, newState: any): boolean =>
      R.any((statePath: string): boolean => {
        const path = State.find(statePath).getPath()
        const valueInOldState = R.path(path, oldState)
        const valueInNewState = R.path(path, newState)

        return R.not(deepEqual(valueInNewState, valueInOldState))
      }, states)

    subscribeStates = (): void => {
      const { store } = this.context
      let oldState: any = store.getState()

      unsubscribe = store.subscribe((): void => {
        const newState: any = store.getState()
        const hasChanges: boolean = this.checkStatesChange(oldState, newState)

        if (hasChanges) {
          this.updateArgs(newState, store.dispatch)
          oldState = newState
        }
      })
    }

    componentWillMount() {
      const { dispatch, getState} = this.context.store
      this.updateArgs(getState(), dispatch)
    }

    componentDidMount() {
      this.subscribeStates()
    }

    componentWillUnmount() {
      unsubscribe()
    }

    render(): JSX.Element {
      return (
        <WrappedComponent {...this.props} {...this.state.props} />
      )
    }
  }
}

export default connect
