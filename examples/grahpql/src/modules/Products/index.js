import t from 'prop-types'
import React from 'react'
import { gql, graphql } from 'react-apollo'

const Products = ({ data }) => {
  if (data.loading) return <div>Carregando...</div>

  return (
    <div>
      <h3>Product List</h3>
      <ul>
        {data.allProducts.map(product => (
          <li key={product.id}>
            {product.name} R${product.value}
          </li>
        ))}
      </ul>
    </div>
  )
}

Products.propTypes = {
  data: t.object.isRequired,
}

const query = gql`
  {
    allProducts {
      id
      name
      value
    }
  }
`

export default graphql(query)(Products)
