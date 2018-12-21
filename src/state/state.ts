import { types as t, flow } from 'mobx-state-tree'
import { ApiModel } from './api'
import { GeodataModel } from './geo-data'
import { SelectionModel } from './selection'
import { LoadingModel } from './loading'
import { PanelModel } from './panel'
import { StatsModel } from './stats'
import { ToolSelectionModel } from './tool-selection'
import { FiltersModel } from './filters'
import { AutocompleteModel } from './autocomplete'
import { MapModel } from './map'
import { mapboxBoundsToElasticsearchGeoGrid } from '../lib/conversions'
import { ElasticsearchGeoGridType, MapboxBoundsType } from '../typings'
import { getTilesIndexRange, filterTilesByIndex, getTileCoords } from '../lib/split-bounding-box'
import { DEFAULT_BOUNDS } from '../lib/map-config'
import difference from 'lodash/difference'
const { RouterModel } = require('mst-react-router')

export const StateModel = t
  .model('StateModel', {
    api: t.optional(ApiModel, {}),
    routing: t.optional(RouterModel, {}),
    loading: LoadingModel,
    infoboxRight: PanelModel,
    geocoderPanel: PanelModel,
    clipboardPanel: PanelModel,
    selection: SelectionModel,
    toolSelection: ToolSelectionModel,
    geodata: t.array(GeodataModel),
    defaultStats: StatsModel,
    filters: FiltersModel,
    autocomplete: AutocompleteModel,
    loadedTilesIndex: t.optional(t.array(t.array(t.number)), []),
    geocounter: t.optional(t.model('ReqRespCounter', { request: t.number, response: t.number }), {
      request: 0,
      response: 0,
    }),
    map: t.optional(MapModel, { zoom: 0, center: [0, 0] }),
    queryFromClipboard: t.frozen(),

    // currentQuery
  })

  // Handle selections
  .actions(self => {
    const setNewMultiSelection = (newStructuresIds: string[], params: { replace: boolean }) => {
      const { toolSelection, selection, autocomplete } = self
      const newStructuresIdsToString = newStructuresIds.map(s => s.toString())
      const diffIds = difference(newStructuresIdsToString, selection.selectedStructuresIds)
      diffIds.forEach(id => selection.fetchStructureById(id, params))

      let newSelectionIds
      if (!params.replace) {
        newSelectionIds = [...diffIds, ...selection.selectedStructuresIds]
      } else {
        newSelectionIds = [selection.selectedStructuresIds[0]]
      }

      toolSelection.setCurrentSelection({
        modeLabel: 'simple_select',
        value: { ids: newSelectionIds },
      })

      toolSelection.setSavedSelection({
        modeLabel: 'simple_select',
        value: { ids: newSelectionIds },
      })

      autocomplete.setVisibility(false)
    }

    const setNewCircleSelection = async (center: [number, number], radiusInKm: number) => {
      const { api, toolSelection, selection } = self
      toolSelection.setSavedSelection({ modeLabel: 'draw_radius', value: { center, radiusInKm } })
      toolSelection.setCurrentSelection({ modeLabel: 'draw_radius', value: { center, radiusInKm } })
      const data = await api.fetchStructuresByRadius(center, radiusInKm)
      selection.setStructures(data)
    }

    const setNewPolygonSelection = async (polygon: number[][]) => {
      const { api, toolSelection, selection } = self
      toolSelection.setSavedSelection({ modeLabel: 'draw_polygon', value: { polygon } })
      toolSelection.setCurrentSelection({ modeLabel: 'draw_polygon', value: { polygon } })
      const data = await api.fetchStructuresByPolygon(polygon)
      selection.setStructures(data)
    }

    return {
      setNewMultiSelection,
      setNewCircleSelection,
      setNewPolygonSelection,
    }
  })

  // Handle request/response counter
  .actions(self => {
    const increaseReqRespCounter = (type: 'request' | 'response') => {
      self.geocounter[type]++
    }

    return {
      increaseReqRespCounter,
    }
  })

  .views(self => {
    return {
      get isGeorequestPending() {
        return self.geocounter.request > self.geocounter.response
      },
    }
  })

  // Handle data fetch (wrapper around api)
  .actions(self => {
    // Test data with query 'faenza'
    const fetchTestGeodata = flow(function* loadData() {
      const { api } = self
      self.loading.state = 'pending'

      try {
        const data = yield api.fetchGeodataByQuery('faenza')
        self.loading.state = 'done'
        self.geodata.replace(data)
      } catch (error) {
        console.error(error)
        self.loading.state = 'error'
      }
    })

    // Default stats
    const fetchDefaultStats = flow(function* loadData() {
      const { api } = self
      try {
        const data = yield api.fetchDefaultStats()
        self.defaultStats = data
      } catch (error) {
        console.error(error)
      }
    })

    // When the bounding box has changed
    const fetchGeodataByBoundingBox = (geoGrid: ElasticsearchGeoGridType) => {
      return flow(function* updateData() {
        const { api } = self

        self.increaseReqRespCounter('request')
        if (self.isGeorequestPending) {
          self.loading.state = 'pending'
        }

        try {
          const data = yield api.fetchGeodataByBoundingBox(geoGrid)
          self.increaseReqRespCounter('response')

          if (!self.isGeorequestPending) {
            self.loading.state = 'done'
          }
          if (data.length) {
            self.geodata.push(...data)
          }
        } catch (error) {
          console.error(error)
          self.loading.state = 'error'
          self.increaseReqRespCounter('response')
        }
      })()
    }

    return {
      fetchTestGeodata,
      fetchDefaultStats,
      fetchGeodataByBoundingBox,
    }
  })

  // Handle batch requests for new tiles
  .actions(self => {
    const parseBoundingBoxAndFetchGeodata = (bounds: MapboxBoundsType) => {
      const geoGrid = mapboxBoundsToElasticsearchGeoGrid(bounds)
      const tilesIndexRange = getTilesIndexRange(geoGrid)
      const filteredTilesIndex = filterTilesByIndex(self.loadedTilesIndex, tilesIndexRange)

      if (filteredTilesIndex.length) {
        const geoGridTiles = filteredTilesIndex.map(index => getTileCoords(index))
        self.loadedTilesIndex.push(...(filteredTilesIndex as any))
        geoGridTiles.forEach(geoGridTile => {
          self.fetchGeodataByBoundingBox(geoGridTile)
        })
      }
    }

    return { parseBoundingBoxAndFetchGeodata }
  })

  // Computed to transform data in GEOJSON, like Mapbox wants them
  .views(self => {
    return {
      get dataAsGEOJSON() {
        return {
          type: 'FeatureCollection',
          features: self.geodata.map(structure => structure.datumAsGeoJSON),
        }
      },

      get selectedDataAsGEOJSON() {
        return {
          type: 'FeatureCollection',
          features: self.geodata.filter(g => {
            const selectedStructuresIds = self.selection.structures.map(s => s.id)

            const isSelected = selectedStructuresIds.includes(g.id)
            if (isSelected) {
              return g.datumAsGeoJSON
            }

            return null
          }),
        }
      },
    }
  })

  .views(self => {
    return {
      get goToFullResultsLink() {
        return `http://researchalps.data-publica.com/recherche?ids=${self.selection.selectedStructuresIds.join(
          ',',
        )}`
      },

      get getQueryFromClipboard() {
        const { selection, map } = self
        const latestQuery = {
          selectedStructuresIds: selection.selectedStructuresIds,
          map,
        }
        return JSON.stringify(latestQuery)
      },
    }
  })

  .actions(self => {
    const setQueryFromClipboard = function(query: string) {
      const q = JSON.parse(query)
      self.queryFromClipboard = q
      self.selection.clearStructures()
      q.selectedStructuresIds.forEach((id: string) =>
        self.selection.fetchStructureById(id, { replace: false }),
      )
    }

    const closeAllPanels = function() {
      const {autocomplete, geocoderPanel, clipboardPanel} = self
        autocomplete.close()
        geocoderPanel.close()
        clipboardPanel.close()
    }

    return {
      setQueryFromClipboard,
      closeAllPanels,
    }
  })

  // Actions to perform on page load
  .actions(self => {
    const afterCreate = function() {
      self.parseBoundingBoxAndFetchGeodata(DEFAULT_BOUNDS)
      // setTimeout(() => self.parseBoundingBoxAndFetchGeodata(DEFAULT_BOUNDS), 200)
      // self.fetchTestGeodata()
      self.fetchDefaultStats()
    }

    return { afterCreate }
  })

export type StateType = typeof StateModel.Type

export const state = StateModel.create({
  loading: { state: 'done' },
  infoboxRight: { state: false },
  geocoderPanel: { state: false },
  clipboardPanel: { state: false },
  selection: { structures: [], filteredStructures: [] },
  toolSelection: {
    modeLabel: 'simple_select',
    current: { modeLabel: 'simple_select', value: { ids: [] } },
  },
  geodata: [],
  defaultStats: {
    structures: 0,
    websites: 0,
    projects: 0,
    publications: 0,
  },
  filters: {
    children: {
      bounds: [0, 0],
      activeBounds: [0, 0],
    },
    projects: {
      bounds: [0, 0],
      activeBounds: [0, 0],
    },
    publications: {
      bounds: [0, 0],
      activeBounds: [0, 0],
    },
    linked: {
      bounds: [0, 0],
      activeBounds: [0, 0],
    },
  },
  autocomplete: { isVisible: false, currentValue: '', isLoading: false, suggestions: [] },
  queryFromClipboard: undefined,
})

export interface Statable {
  globalState?: StateType
}

;(window as any).__GLOBAL = state
