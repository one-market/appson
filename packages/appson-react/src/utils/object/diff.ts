import R from 'ramda'

type DiffObj = object | null | undefined

const normalize = R.reduce((obj, { name, fn }) => R.assoc(name, fn, obj), {})

const denormalize = (items: DiffObj) =>
  R.map(name => ({ name, fn: R.prop(name, items) }), R.keys(items))

const denormalizedDiff = (prev: DiffObj, current: DiffObj) => R.differenceWith(
  R.eqProps('name'),
  denormalize(prev),
  denormalize(current),
)

const symmetricDenormalizedDiff = (prev: DiffObj, current: DiffObj) => R.symmetricDifferenceWith(
  R.eqProps('name'),
  denormalize(prev),
  denormalize(current),
)

export const diff = R.pipe(denormalizedDiff, normalize)
export const symmetricDiff = R.pipe(symmetricDenormalizedDiff, normalize)
