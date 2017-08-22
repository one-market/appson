import R from 'ramda'

const normalize = R.reduce((obj, { name, fn }) => R.assoc(name, fn, obj), {})
const denormalize = (items) => R.map(name => ({ name, fn: R.prop(name, items) }), R.keys(items))

const diffByMethod = (method) => (prev, current) => R.prop(method, R)(
  R.eqProps('name'),
  denormalize(prev),
  denormalize(current),
)

export const diff = R.pipe(diffByMethod('differenceWith'), normalize)
export const symmetricDiff = R.pipe(diffByMethod('symmetricDifferenceWith'), normalize)
