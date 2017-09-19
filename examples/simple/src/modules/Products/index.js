import R from 'ramda'
import t from 'prop-types'
import React from 'react'
import { addState, connectProps } from '@appson/react'

import products from './states/products'
import AddProduct from './components/AddProduct'

const Products = ({ products, quantity }) => (
  <div>
    <h4>Showing: {quantity} products</h4>
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
      <AddProduct />
    </ul>
  </div>
)

Products.propTypes = {
  products: t.array.isRequired,
  quantity: t.number.isRequired,
}

const enhance = R.compose(
  addState(products),
  connectProps(['products'], (products) => ({
    ...products,
    products: products.list,
  }))
)

export default enhance(Products)
