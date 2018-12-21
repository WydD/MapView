import { types as t, flow, getRoot } from 'mobx-state-tree'

export const LoadingModel = t
  .model('LoadingModel', {
    state: t.enumeration(['pending', 'done', 'error']),
  })
  .actions(self => {
    const setLoadingState = (state: 'pending' | 'done' | 'error') => {
      self.state = state
    }

    return {
      setLoadingState,
    }
  })

export type LoadingType = typeof LoadingModel.Type
