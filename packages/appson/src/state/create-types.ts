import { StateReducerMap } from '../../index.d'

import R from 'ramda'
import invariant from 'invariant'

const PREFIX = '@@states'

const snakeCase = (str: string) =>
  str.replace(/([A-Z])/g, (char) => `_${char.toLowerCase()}`)

const typeByHandlersKeys = (name: string) => (type: string) =>
  `${PREFIX}/${name}/${snakeCase(type).toUpperCase()}`

const createTypes = (name: string, reducers: StateReducerMap<any, any>) => {
  invariant(
    R.values(reducers).every(R.is(Function)),
    'All of you reducers need to be a function'
  )

  return R.keys(reducers).map(typeByHandlersKeys(name))
}

export default createTypes
