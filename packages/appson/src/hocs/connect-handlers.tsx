import t from 'prop-types'
import R from 'ramda'
import React, { PureComponent } from 'react'
import { Dispatch } from 'redux'

import { AppStore } from '../appson'
import State from '../state'
import getDisplayName from '../utils/get-display-name'
import * as invariants from '../utils/invariants'

export type ConnectHandlerState = {
  handlers: object,
  args: object,
}

export interface MapperFn {
  (...states: object[]): object
}

export interface ConnectFn<NP = any, P = any> {
  (states: string[], mapper?: MapperFn):
    (WrappedComponent: React.ComponentType<P>) => React.ComponentType<P & NP>
}

type ConnectHandlersContext = {
  store: AppStore,
}

const reduceIndexed = R.addIndex(R.reduce)

const connectHandlers: ConnectFn = (states, mapHandlers) => (WrappedComponent) => {
  if (mapHandlers) {
    invariants.isFn('mapHandlers', mapHandlers)
  }

  return class ConnectHandlers extends PureComponent<{}, ConnectHandlerState> {
    context: ConnectHandlersContext

    static displayName: string = `ConnectHandlers(${getDisplayName(WrappedComponent)})`

    static contextTypes = {
      store: t.object,
    }

    state = {
      handlers: {},
      args: {},
    }

    updateHandlers = (args: object): void =>
      this.setState({
        handlers: mapHandlers ? mapHandlers(...R.values(args)) : R.mergeAll(R.values(args)),
      })

    getArgs = (dispatch: Dispatch<any>) =>
      (obj: object, path: string, idx: number): object => {
        const state: State<any> = State.find(path)
        return state ? R.assoc(`${idx}`, state.mapDispatch(dispatch), obj) : obj
      }

    updateArgs = (globalState: any): void => {
      const { args } = this.state

      const newArgs: object = reduceIndexed(this.getArgs(globalState), args, states)
      const hasArgs: boolean = R.not(R.isNil(newArgs))

      if (hasArgs) {
        this.setState({ args: newArgs })
        this.updateHandlers(newArgs)
      }
    }

    componentWillMount() {
      this.updateArgs(this.context.store.dispatch)
    }

    render(): JSX.Element {
      return (
        <WrappedComponent {...this.state.handlers} {...this.props} />
      )
    }
  }
}

export default connectHandlers
