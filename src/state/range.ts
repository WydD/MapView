import { types as t } from 'mobx-state-tree'

export const RangeModel = t
  .model('RangeModel', {
    bounds: t.array(t.number),
    activeBounds: t.array(t.number),
  })
  .actions(self => {
    const updateBounds = (newBounds: number[]) => {
      self.bounds.replace(newBounds)
    }

    const updateActiveBounds = (newBounds: number[]) => {
      self.activeBounds.replace(newBounds)
    }

    const syncBounds = () => {
      self.activeBounds.replace(self.bounds)
    }

    return {
      updateBounds,
      updateActiveBounds,
      syncBounds,
    }
  })
export type RangeType = typeof RangeModel.Type
