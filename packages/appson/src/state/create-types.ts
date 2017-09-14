import { ActionTypes, ReducerMap } from '../../index.d'
import R from 'ramda'

const PREFIX = '@@states'

const snakeCase = (str: string): string =>
  str.replace(/([A-Z])/g, (char) => `_${char.toLowerCase()}`)

const typeByHandlersKeys = (name: string) => (type: string): string =>
  `${PREFIX}/${name}/${snakeCase(type).toUpperCase()}`

const createTypes = (name: string, reducers: ReducerMap<any>): ActionTypes =>
  R.keys(reducers).map(typeByHandlersKeys(name))

export default createTypes
