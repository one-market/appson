import * as R from 'ramda'
import React from 'react'
import { Routes, Route, Link, addState } from '@onemarket/appson'

import main from './states/main'

import Home from './modules/Home'
import Products from './modules/Products'
import NoMatch from './modules/NoMatch'

const GraphQLExample = () => (
  <div>
    <h1>GraphQL Example</h1>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/Products">Products</Link></li>
    </ul>
    <Routes>
      <Route exact path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route component={NoMatch} />
    </Routes>
  </div>
)

const enhance = R.compose(
  addState(main)
)

export default enhance(GraphQLExample)
