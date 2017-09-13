import R from 'ramda'
import { SagaIterator } from 'redux-saga'
import { all, fork, cancel } from 'redux-saga/effects'

import { diff, symmetricDiff } from '../utils/diff-object'
import effectsStore, { setActiveEffects } from '../stores/effects'

const sDiffAndFilterByFn = R.pipe(symmetricDiff, R.pickBy(R.is(Function)))

type EffectsParams = {
  active: object,
  effects: object,
}

export default function* effectsSaga({ active, effects }: EffectsParams): SagaIterator {
  const tasksToCancel = diff(active, effects)
  const activeWithoutCanceled = diff(active, tasksToCancel)
  const effectsToFork = sDiffAndFilterByFn(active, effects)

  for (const task of R.values(tasksToCancel)) {
    yield cancel(task)
  }

  const tasks = yield all(R.mapObjIndexed(fork, effectsToFork))
  const newActive = R.merge(tasks, activeWithoutCanceled)

  effectsStore.dispatch(setActiveEffects(newActive))
}
