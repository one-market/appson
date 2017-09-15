import R from 'ramda'
import t from 'prop-types'
import React from 'react'
import { addState, connect } from 'appson'

import products from './states/products'
import AddProducts from './components/AddProduct'

const Products = ({ products }) => (
  <ul>
    {products.map(product => (
      <li key={product.id}>{product.name}</li>
    ))}
    <AddProducts />
  </ul>
)

Products.propTypes = {
  products: t.array.isRequired,
}

const enhance = R.compose(
  addState(products),
  connect(['products'], (products) => ({
    products: products.list,
  }))
)

export default enhance(Products)
