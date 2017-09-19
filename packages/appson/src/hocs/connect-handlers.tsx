import { ConnectFn, AppStore } from '../../index.d'

import t from 'prop-types'
import R from 'ramda'
import React, { PureComponent } from 'react'
import { Dispatch } from 'redux'

import State from '../state'
import getDisplayName from '../utils/get-display-name'
import * as invariants from '../utils/invariants'

type Context = {
  store: AppStore,
}

type ConnectState = {
  handlers: object,
  args: object,
}

const reduceIndexed = R.addIndex(R.reduce)

const connectHandlers: ConnectFn = (states, mapHandlers) => (WrappedComponent) => {
  if (mapHandlers) {
    invariants.isFn('mapHandlers', mapHandlers)
  }

  return class ConnectHandlers extends PureComponent<{}, ConnectState> {
    context: Context

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
      (obj: object, path: string, idx: number): object =>
        State.exist(path) ? R.assoc(`${idx}`, State.find(path).mapDispatch(dispatch), obj) : obj

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
