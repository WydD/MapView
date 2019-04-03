import { types as t } from 'mobx-state-tree'
import Worker from 'worker-loader!../lib/fetcher.worker'
import { ElasticsearchGeoGridType } from '../typings'
import { LOG_COLOR_REQUEST } from './constants'
import { mapToGeodataModel } from '../lib/conversions'

const apiEndpoint = process.env.API_ENDPOINT

export const ApiModel = t.model('Api', {}).actions(self => {
  function fetchData(url: string, title: string, reqType: 'post' | 'get', params?: {}) {
    const promise = new Promise(resolve => {
      const worker = new Worker()
      worker.onmessage = (e: any) => {
        const result = JSON.parse(e.data)
        // console.log(`%c ${title}`, LOG_COLOR_REQUEST, { api: result })
        resolve(result)
      }
      worker.postMessage(JSON.stringify({ reqType, url, params }))
    })
    return promise
  }
  const urlParams = new URLSearchParams(window.location.search);
  let search = urlParams.get("search");
  if (search) {
    try {
      search = JSON.parse(search);
    } catch {
      console.error("Cant parse content", search);
      search = null;
    }
  } else {
    search = null;
  }
  return {
    fetchGeodataByQuery: async (query: string) => {
      const url = `${apiEndpoint}structures/search/georesults`
      const ret: any = await fetchData(url, 'georesults', 'post', { query })
      const latlondata = mapToGeodataModel(ret.data.results)
      return latlondata
    },

    fetchGeodataByBoundingBox: async (geoGrid: ElasticsearchGeoGridType) => {
      console.log(JSON.stringify({topLeft: geoGrid.topLeft, bottomRight: geoGrid.bottomRight, searchRequest: search}));
      const url = `${apiEndpoint}structures/search/geo/bbox`
      const ret: any = await fetchData(url, 'georesults', 'post', {topLeft: geoGrid.topLeft, bottomRight: geoGrid.bottomRight, searchRequest: search})
      const latlondata = mapToGeodataModel(ret.data)
      return latlondata
    },

    fetchDefaultStats: async () => {
      const url = `${apiEndpoint}stats/`
      const ret: any = await fetchData(url, 'stats', 'get')
      const stats = ret.data
      return stats
    },

    fetchStructureSuggestions: async (searchKey: string) => {
      const url = `${apiEndpoint}structures/search/geo/label?size=10&query=${searchKey}`
      const ret: any = await fetchData(url, 'autosuggest', 'post')
      return ret.data
    },

    fetchStructureById: async (id: string) => {
      const url = `${apiEndpoint}structures/search/geo/id/${id}`
      const ret: any = await fetchData(url, 'structure', 'post')
      return ret.data
    },

    fetchStructuresByPolygon: async (polygon: number[][]) => {
      const url = `${apiEndpoint}structures/search/geo/polygon`
      const _polygon = polygon.map(point => ({ lat: point[1], lon: point[0] }))
      const ret: any = await fetchData(url, 'structure', 'post', {polygon: _polygon, searchRequest: search})
      return ret.data
    },

    fetchStructuresByRadius: async (center: [number, number], radiusInKm: number) => {
      const url = `${apiEndpoint}structures/search/geo/distance`
      const ret: any = await fetchData(url, 'structure', 'post', {
        center: { lon: center[0], lat: center[1] },
        distance: `${radiusInKm}km`,
        searchRequest: search
      })
      return ret.data
    },
  }
})
