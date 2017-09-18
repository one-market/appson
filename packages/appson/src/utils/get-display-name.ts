import R from 'ramda'

const isStr = R.is(String)

const getDisplayName = (Component: any): string => (
  Component.displayName ||
  Component.name ||
  (isStr(Component) && R.isNil(Component) ? Component : 'Unknown')
)

export default getDisplayName
