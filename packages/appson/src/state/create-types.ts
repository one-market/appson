import { ActionTypes, HandlerMap } from '../../index.d'
import R from 'ramda'

const snakeCase = (str: string): string =>
  str.replace(/([A-Z])/g, (char: string): string => `_${char.toLowerCase()}`)

const typeByHandlersKeys = (stateName: string) => (type: string): string =>
  `@@states/${stateName}/${snakeCase(type).toUpperCase()}`

const createTypes = (stateName: string, handlers: HandlerMap): ActionTypes =>
  R.map(typeByHandlersKeys(stateName), R.keys(handlers))

export default createTypes
