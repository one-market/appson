import React from 'react'
import { Routes, Route, Link } from '@onemarket/appson'

import Home from './modules/Home'
import NoMatch from './modules/NoMatch'

const Typescript = () => (
  <div>
    <h1>Typescript</h1>
    <ul>
      <li><Link to="/">Home</Link></li>
    </ul>
    <Routes>
      <Route exact path="/" component={Home} />
      <Route component={NoMatch} />
    </Routes>
  </div>
)

export default Typescript
