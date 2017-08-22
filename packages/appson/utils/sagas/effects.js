import R from 'ramda'
import { all, fork } from 'redux-saga/effects'

import { stores, diffAndNormalize } from '../stores/appson'
import transformValues from '../object/transform-values'

const replaceActiveTasks = (payload) => ({
  type: '@@appson/REPLACE_ACTIVE_TASKS',
  payload,
})

const cancelTasks = (running, effects) => {
  const diff = diffAndNormalize('differenceWith')
  const foundTasks = diff(running, effects)

  for (const task of R.values(foundTasks)) task.cancel()
  return foundTasks
}

const effectsToRun = (running, effects) => {
  const diff = diffAndNormalize('symmetricDifferenceWith')
  const foundEffects = diff(running, effects)

  return R.reduce((obj, item) =>
    R.is(Function, item[1]) ? R.assoc(item[0], item[1], obj) : obj, {}, R.toPairs(foundEffects)
  )
}

const activeWithoutCanceled = (running, tasks) =>
  R.fromPairs(R.difference(R.toPairs(running), R.toPairs(tasks)))

export default function* effectsSaga({ activeTasks, effects }) {
  const tasksToCancel = cancelTasks(activeTasks, effects)
  const filteredEffects = effectsToRun(activeTasks, effects)
  const filteredTasks = activeWithoutCanceled(activeTasks, tasksToCancel)
  const tasks = yield all(transformValues(fork)(filteredEffects))
  const newActiveTasks = R.merge(tasks, filteredTasks)

  stores.effects.dispatch(replaceActiveTasks(newActiveTasks))
}
