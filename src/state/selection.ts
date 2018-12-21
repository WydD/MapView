import { types as t, flow, getRoot } from 'mobx-state-tree'
import { GeodataModel } from './geo-data'
import { SelectedStructureModel, SelectedStructureType } from './selected-structure'
import { RangeType } from './range'
import { StateType } from './state'
import { getStructureKey } from '../lib/structure-keys'

export const SelectionModel = t
  .model('Selection', {
    structures: t.array(SelectedStructureModel),
    filteredStructures: t.array(t.reference(SelectedStructureModel)),
  })

  .actions(self => {
    const setFilteredStructuresByBounds = () => {
      const { filters }: StateType = getRoot(self)
      const filtersKey = Object.keys(filters)

      const filteredStructures = self.structures.filter(structure => {
        const isStructureInAllFiltersBounds = filtersKey
          .map(filterKey => {
            const activeBounds = filters[filterKey].activeBounds
            const currentStructureValue = structure.content[filterKey]

            return (
              currentStructureValue >= activeBounds[0] && currentStructureValue <= activeBounds[1]
            )
          })
          .every(Boolean)
        return isStructureInAllFiltersBounds
      })

      self.filteredStructures.replace(filteredStructures.map(f => f.content.id))
    }

    const setFilteredStructuresByClick = (structure: SelectedStructureType) => {
      self.filteredStructures.replace([structure.content.id])
    }

    const resetFilteredStructures = () => {
      self.filteredStructures.replace(self.structures.map(s => s.content.id))
    }

    return {
      setFilteredStructuresByBounds,
      setFilteredStructuresByClick,
      resetFilteredStructures,
    }
  })

  .actions(self => {
    const fetchStructureById = (id: string, params: { replace: boolean }) => {
      return flow(function* loadData() {
        const alreadyInArray = self.structures.map(s => s.id).includes(id)

        if (!alreadyInArray) {
          const { api, loading, filters } = getRoot(self)
          try {
            const newStructureData = yield api.fetchStructureById(id)

            const _newStructureData = {
              id: newStructureData.id,
              content: newStructureData,
            }

            if (params.replace) {
              filters.replaceAllBounds([_newStructureData])
              filters.syncBounds()
              self.structures.replace([_newStructureData])
            } else {
              filters.updateAllBounds(_newStructureData)
              filters.syncBounds()
              self.structures.push(_newStructureData)
            }

            self.setFilteredStructuresByBounds()
          } catch (error) {
            console.error(error)
            loading.setLoadingState('error')
          }
        }
      })()
    }

    return {
      fetchStructureById,
    }
  })

  .actions(self => {
    const clearStructures = () => {
      self.filteredStructures.clear()
      self.structures.clear()
    }

    const setStructures = (structures: any) => {
      const { filters } = getRoot(self)

      const _structures = structures.map((s: any) => ({
        id: s.id,
        content: s,
      }))

      filters.replaceAllBounds(_structures)
      filters.syncBounds()
      self.structures.replace(_structures)
      self.setFilteredStructuresByBounds()
    }

    return {
      clearStructures,
      setStructures,
    }
  })

  .views(self => {
    return {
      get selectedStructuresIds() {
        return self.structures.map(s => s.id)
      },

      get filteredStructuresIds() {
        return self.filteredStructures.map(s => s.id)
      },
    }
  })

export type SelectionType = typeof SelectionModel.Type
