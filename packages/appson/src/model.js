import R from 'ramda'
import { model as reedxModel } from 'reedx'
import transformValues from '../utils/object/transform-values'

export const isModel = R.has('modelName')
export const getEffects = R.prop('effects')
export const getModelName = R.prop('modelName')

const transformToDefineProps = transformValues(
  (value) => ({ value, writable: false })
)

const model = (props) => {
  const model = reedxModel(props)

  Object.defineProperties(model, transformToDefineProps(model.actions))
  return model
}

export default model
