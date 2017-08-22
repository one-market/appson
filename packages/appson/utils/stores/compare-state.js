import R from 'ramda'

const compareState = (getState, path) => {
  const fromPath = R.path(path)
  let currentValue = fromPath(getState())

  return (fn) => () => {
    const newValue = fromPath(getState())

    if (R.not(R.equals(currentValue, newValue))) {
      fn(newValue, currentValue, path)
      currentValue = newValue
    }
  }
}

export default compareState
