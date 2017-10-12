import * as R from 'ramda'

const isArr = R.is(Array)
const isObj = R.is(Object)
const isDate = R.is(Date)
const isRegExp = R.is(RegExp)

const deepEqualArr = (x: any[], y: any[]): boolean => {
  if (x.length !== y.length) return false

  for (let i = 0; i < y.length; i++) {
    if (!deepEqual(x[i], y[i])) return false
  }

  return true
}

const deepEqualObj = (x: any, y: any): boolean => {
  const keysX: string[] = R.keys(x)
  const keysY: string[] = R.keys(y)

  if (keysX.length !== keysY.length) return false

  const isDateX: boolean = isDate(x)
  const isDateY: boolean = isDate(y)

  if (isDateX && isDateY) return x.getTime() === y.getTime()
  if (isDateX !== isDateY) return false

  const isRegExpX: boolean = isRegExp(x)
  const isRegExpY: boolean = isRegExp(y)

  if (isRegExpX && isRegExpY) return x.toString() === y.toString()
  if (isRegExpX !== isRegExpY) return false

  for (let i = 0; i < keysX.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(y, keysX[i])) return false
  }

  for (let i = 0; i < keysX.length; i++) {
    if (!deepEqual(x[keysX[i]], y[keysX[i]])) return false
  }

  return true
}

const deepEqual = (x: any, y: any): boolean => {
  if (x === y) return true

  const isArrX: boolean = isArr(x)
  const isArrY: boolean = isArr(y)

  if (isArrX && isArrY) return deepEqualArr(x, y)
  if (isArrX !== isArrY) return false

  if (isObj(x) && isObj(y)) return deepEqualObj(x, y)

  return false
}

export default deepEqual
