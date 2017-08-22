import R from 'ramda'
import t from 'prop-types'
import React, { PureComponent } from 'react'

import { toggleReducer } from '../utils/stores/appson'
import { getModelName, getEffects } from './model'
import withEffects from './with-effects'

const modelToReducer = (model) =>
  R.assoc(getModelName(model), model, {})

const withModel = (model) => (WrappedComponent) => {
  const effects = getEffects(model)
  const newReducer = modelToReducer(model)
  const action = toggleReducer(newReducer)
  const Component = effects ? withEffects(effects)(WrappedComponent) : WrappedComponent

  class AddModels extends PureComponent {
    static contextTypes = {
      appson: t.object,
    }

    dispatchActions = () => {
      this.context.appson.dispatch(action)
    }

    componentWillMount() {
      this.dispatchActions()
    }

    componentWillUnmount() {
      this.dispatchActions()
    }

    render() {
      return (
        <Component {...this.props} />
      )
    }
  }

  return AddModels
}

export default withModel
