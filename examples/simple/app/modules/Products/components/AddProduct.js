import t from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { reducersFrom } from 'appson'
import { v4 } from 'uuid'

import products from '../states/products'

class AddProducts extends PureComponent {
  static propTypes = {
    add: t.func.isRequired,
  }

  state = {
    name: '',
  }

  handleChange = (ev) => this.setState({ name: ev.target.value })
  handleAdd = () => this.props.add({ id: v4(), name: this.state.name })

  render() {
    return (
      <div>
        <input type="text" value={this.state.name} onChange={this.handleChange} />
        <button onClick={this.handleAdd}>
          Add Product
        </button>
      </div>
    )
  }
}

const enhance = connect(null, reducersFrom(products))

export default enhance(AddProducts)
