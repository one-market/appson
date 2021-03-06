import * as R from 'ramda'
import React from 'react'
import { Routes, Route, Link, addState, addEffects } from '@onemarket/appson'
import { AppContainer } from 'react-hot-loader'

import main from './states/main'
import logAction from './effects/log-action'

import Home from './modules/Home'
import Cart from './modules/Cart'
import Products from './modules/Products'
import NoMatch from './modules/NoMatch'

const Simple = () => (
  <AppContainer warnings={false}>
    <div>
      <h1>Simple</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/cart">Cart</Link>
        </li>
      </ul>
      <Routes>
        <Route exact path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/cart" component={Cart} />
        <Route component={NoMatch} />
      </Routes>
    </div>
  </AppContainer>
)

const enhance = R.compose(addState(main), addEffects({ logAction }))

export default enhance(Simple)
