import { ConnectFn, AppStore } from '../../index.d'

import t from 'prop-types'
import R from 'ramda'
import React, { PureComponent } from 'react'

import State from '../state'
import deepEqual from '../utils/object/deep-equal'
import getDisplayName from '../utils/get-display-name'
import * as invariants from '../utils/invariants'

type Context = {
  store: AppStore,
}

type ConnectState = {
  props: object,
  args: object,
}

const reduceIndexed = R.addIndex(R.reduce)

const connectProps: ConnectFn = (states, mapProps) => (WrappedComponent) => {
  if (mapProps) {
    invariants.isFn('mapProps', mapProps)
  }

  let unsubscribe: () => void;

  return class ConnectProps extends PureComponent<{}, ConnectState> {
    context: Context

    static displayName: string = `ConnectProps(${getDisplayName(WrappedComponent)})`

    static contextTypes = {
      store: t.object,
    }

    state = {
      props: {},
      args: {},
    }

    updateProps = (args: object): void =>
      this.setState({
        props: mapProps ? mapProps(...R.values(args)) : R.mergeAll(R.values(args))
      })

    getArgs = (globalState: any) =>
      (obj: object, path: string, idx: number): object =>
        State.exist(path) ? R.assoc(`${idx}`, State.find(path).mapProps(globalState), obj) : obj

    updateArgs = (globalState: any): void => {
      const { args } = this.state

      const newArgs: object = reduceIndexed(this.getArgs(globalState), args, states)
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

    subscribeStates = (): void => {
      const { store } = this.context
      let oldState: any = store.getState()

      unsubscribe = store.subscribe((): void => {
        const newState: any = store.getState()

        const hasChanges: boolean = R.any((statePath: string): boolean =>
          State.exist(statePath) && State.find(statePath).hasChanges(oldState, newState), states
        )

        if (hasChanges) {
          this.updateArgs(newState)
          oldState = newState
        }
      })
    }

    componentWillMount() {
      this.updateArgs(this.context.store.getState())
    }

    componentDidMount() {
      this.subscribeStates()
    }

    componentWillUnmount() {
      unsubscribe()
    }

    render(): JSX.Element {
      return (
        <WrappedComponent {...this.state.props} {...this.props} />
      )
    }
  }
}

export default connectProps
