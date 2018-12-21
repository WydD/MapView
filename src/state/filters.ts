import { types as t, getRoot } from 'mobx-state-tree'
import { RangeModel } from './range'
import { SelectedStructureType } from './selected-structure'

export const FiltersModel = t
  .model('FiltersModel', {
    children: RangeModel,
    projects: RangeModel,
    publications: RangeModel,
    linked: RangeModel,
  })
  .actions(self => {
    const updateRangeBounds = (type: string, newBounds: number[]) => {
      self[type].updateBounds(newBounds)
    }

    const updateActiveRangeBounds = (type: string, newBounds: number[]) => {
      self[type].updateActiveBounds(newBounds)
    }

    // const updateActiveRangeBoundsByStructure = (structure: SelectedStructureType) => {
    //   const keys = Object.keys(self)

    //   keys.forEach(key => {
    //     const bounds = [0, structure.content[getStructureKey(key)].length]
    //     self[key].updateActiveBounds(bounds)
    //   })
    // }

    const updateAllBounds = (structure: SelectedStructureType) => {
      const { selection } = getRoot(self)
      const keys = Object.keys(self)

      keys.forEach(key => {
        const currentBounds = getBounds(selection.structures, key)
        const newBounds = getBounds([structure], key)
        const bounds = [0, Math.max(newBounds[1], currentBounds[1])]
        self[key].updateBounds(bounds)
      })
    }

    const replaceAllBounds = (structures: SelectedStructureType[]) => {
      const { selection } = getRoot(self)
      const keys = Object.keys(self)

      keys.forEach(key => {
        const bounds = getBounds(structures, key)
        self[key].updateBounds(bounds)
      })
    }

    const syncBounds = () => {
      const keys = Object.keys(self)
      keys.forEach(key => self[key].syncBounds())
    }

    return {
      updateRangeBounds,
      updateActiveRangeBounds,
      // updateActiveRangeBoundsByStructure,
      updateAllBounds,
      replaceAllBounds,
      syncBounds,
    }
  })

export type FiltersType = typeof FiltersModel.Type

function getBounds(structures: any, structureKey: string) {
  return structures.reduce(
    (acc: any, next: any) => {
      const currentValue = next.content[structureKey]
      if (currentValue < acc[0]) {
        return [currentValue, acc[1]]
      }
      if (currentValue > acc[1]) {
        return [acc[0], currentValue]
      }
      return acc
    },
    [0, 0],
  )
}
