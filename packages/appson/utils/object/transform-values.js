import R from 'ramda'

const transformValues = (transform) => (obj) => R.reduce((obj, item) =>
  R.assoc(item[0], transform ? transform(item[1]) : item[1], obj), {}, R.toPairs(obj)
)

export default transformValues
