import R from 'ramda'
import t from 'prop-types'
import React from 'react'
import { addState, connect } from 'appson'

import products from './states/products'
import AddProducts from './components/AddProduct'

const Products = ({ products, quantity }) => (
  <div>
    <h4>Showing: {quantity} products</h4>
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
      <AddProducts />
    </ul>
  </div>
)

Products.propTypes = {
  products: t.array.isRequired,
  quantity: t.number.isRequired,
}

const enhance = R.compose(
  addState(products),
  connect(['products'], (products) => ({
    products: products.list,
    quantity: products.quantity,
  }))
)

export default enhance(Products)
