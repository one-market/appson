import R from 'ramda'
import { all, fork, cancel } from 'redux-saga/effects'

import effectsStore, { setActiveEffects } from '../stores/effects'
import { diff, symmetricDiff } from '../object/diff'

const sDiffAndFilterByFn = R.pipe(symmetricDiff, R.pickBy(R.is(Function)))

function* cancelTasks(tasks) {
  for (const task of R.values(tasks)) {
    yield cancel(task)
  }
}

export default function* effectsSaga({ active, effects }) {
  const tasksToCancel = diff(active, effects)
  const activeWithoutCanceled = diff(active, tasksToCancel)
  const effectsToFork = sDiffAndFilterByFn(active, effects)

  yield cancelTasks(tasksToCancel)

  const tasks = yield all(R.mapObjIndexed(fork, effectsToFork))
  const newActive = R.merge(tasks, activeWithoutCanceled)

  effectsStore.dispatch(setActiveEffects(newActive))
}
