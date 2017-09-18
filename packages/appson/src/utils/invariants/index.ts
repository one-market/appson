import R from 'ramda'
import invariant from 'invariant'

const isObj = R.is(Object)
const isFunc = R.is(Function)
const isStr = R.is(String)
const isArr = R.is(Array)

export const isArrayOfString = (name: string, array: string[]) =>
  invariant(
    isArr(array) && array.length && R.all(isStr, array),
    `Expected ${name} to be an array of string`
  )

export const isString = (name: string, value: string) =>
  invariant(
    !R.isNil(value) && isStr(value),
    `Expected ${name} to be a string`
  )

export const isPlainObject = (name: string, obj: object) =>
  invariant(
    !R.isNil(obj) && isObj(obj),
    `Expected ${name} to be a plain object`
  )

export const hasAllValuesAsFunction = (name: string, obj: object) =>
  invariant(
    !R.isNil(obj) && R.all(isFunc, R.values(obj)),
    `Expected all values of object ${name} to be a function`
  )

export default invariant
