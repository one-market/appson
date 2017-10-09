import t from 'prop-types'
import R from 'ramda'
import React, { PureComponent } from 'react'

import { AppStore } from '../appson'
import State from '../state'
import deepEqual from '../utils/object/deep-equal'
import getDisplayName from '../utils/get-display-name'
import * as invariants from '../utils/invariants'

export type ConnectPropsState = {
  props: object,
  args: object,
}

export interface MapperFn {
  (...states: object[]): object
}

export interface ConnectFn<P = any, NP = any> {
  (states: string[], mapper?: MapperFn):
    (WrappedComponent: React.ComponentType<P>) => React.ComponentType<P & NP>
}

export type ConnectPropsContext = {
  store: AppStore,
}

const reduceIndexed = R.addIndex(R.reduce)

const connectProps: ConnectFn = (states, mapProps) => (WrappedComponent) => {
  if (mapProps) {
    invariants.isFn('mapProps', mapProps)
  }

  let unsubscribe: () => void

  return class ConnectProps extends PureComponent<{}, ConnectPropsState> {
    context: ConnectPropsContext

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
        props: mapProps ? mapProps(...R.values(args)) : R.mergeAll(R.values(args)),
      })

    getArgs = (globalState: any) =>
      (obj: object, path: string, idx: number): object => {
        const state: State<any> = State.find(path)
        return state ? R.assoc(`${idx}`, state.mapProps(globalState), obj) : obj
      }

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

        const hasChanges = R.any((path: string): boolean => {
          const state: State<any> = State.find(path)
          return state && state.hasChanges(oldState, newState)
        })

        if (hasChanges(states)) {
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
