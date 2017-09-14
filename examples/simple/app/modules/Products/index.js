import R from 'ramda'
import t from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { addState, propsFrom, pick } from 'appson'

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
  connect(
    propsFrom(pick(products, ['list:products']))
  )
)

export default enhance(Products)
