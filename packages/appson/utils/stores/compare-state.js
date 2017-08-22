import R from 'ramda'

export const s = (string: string) => string.split('.');

const compareState = (getState, path) => {
  const fromPath = R.path(s(path))
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
