import React from 'react'
import { withModel } from 'appson'

import products from './models/products'

const Products = () => (
  <div>
    List of products
  </div>
)

export default withModel(products)(Products)
