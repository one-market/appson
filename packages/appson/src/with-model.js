import R from 'ramda'
import t from 'prop-types'
import React, { PureComponent } from 'react'

import { getModelName, getEffects } from './model'
import withEffects from './with-effects'

const modelToReducer = (model) => R.assoc(getModelName(model), model, {})

const toggleReducer = (payload) => ({
  type: '@appson/TOGGLE_REDUCER',
  payload,
})

const withModel = (model) => (WrappedComponent) => {
  const newReducer = modelToReducer(model)
  const action = toggleReducer(newReducer)
  const effects = getEffects(model)

  class AddModels extends PureComponent {
    static contextTypes = {
      reducers: t.object,
    }

    dispatchActions = () => {
      this.context.reducers.dispatch(action)
    }

    componentWillMount() {
      this.dispatchActions()
    }

    componentWillUnmount() {
      this.dispatchActions()
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }

  return effects ? withEffects(effects)(AddModels) : AddModels
}

export default withModel
