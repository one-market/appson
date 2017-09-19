import t from 'prop-types'
import React, { PureComponent } from 'react'
import { connectHandlers } from 'appson'
import { v4 } from 'uuid'

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

export default connectHandlers(['products'])(AddProducts)
