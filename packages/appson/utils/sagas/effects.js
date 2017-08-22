import R from 'ramda'
import { all, fork } from 'redux-saga/effects'

import effectsStore, { setActiveEffects } from '../stores/effects'
import { diff, symmetricDiff } from '../object/diff'
import transformValues from '../object/transform-values'

const isFn = R.is(Function)

const cancelTasks = (active, effects) => {
  const foundTasks = diff(active, effects)

  for (const task of R.values(foundTasks)) task.cancel()
  return foundTasks
}

const filterEffects = (active, effects) => {
  const foundEffects = R.toPairs(symmetricDiff(active, effects))

  return R.reduce((obj, item) =>
    isFn(item[1]) ? R.assoc(item[0], item[1], obj) : obj, {}, foundEffects
  )
}

const activeWithoutCanceled = (active, tasks) =>
  R.fromPairs(R.difference(R.toPairs(active), R.toPairs(tasks)))

export default function* effectsSaga({ active, effects }) {
  const tasksToCancel = cancelTasks(active, effects)
  const filteredEffects = filterEffects(active, effects)
  const filteredTasks = activeWithoutCanceled(active, tasksToCancel)

  const tasks = yield all(transformValues(fork)(filteredEffects))
  const newActive = R.merge(tasks, filteredTasks)

  effectsStore.dispatch(setActiveEffects(newActive))
}
