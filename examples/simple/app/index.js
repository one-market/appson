import R from 'ramda'
import React from 'react'
import { Routes, Route, Link, withModel, withEffects } from 'appson'

import log from './effects/log'
import main from './models/main'

import Home from './modules/Home'
import Cart from './modules/Cart'
import Products from './modules/Products'
import NoMatch from './modules/NoMatch'

const Simple = () => (
  <div>
    <h1>Simple</h1>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/products">Products</Link></li>
      <li><Link to="/cart">Cart</Link></li>
    </ul>
    <Routes>
      <Route exact path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/cart" component={Cart} />
      <Route component={NoMatch} />
    </Routes>
  </div>
)

const enhance = R.compose(
  withModel(main),
  withEffects({ log }),
)

export default enhance(Simple)
