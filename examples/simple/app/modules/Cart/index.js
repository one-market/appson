import React from 'react'
import { withEffects } from 'appson'
import { put } from 'redux-saga/effects'

const Cart = () => (
  <div>
    My cart
  </div>
)

function* test() {
  yield put({ type: 'test' })
}

export default withEffects({ test })(Cart)
