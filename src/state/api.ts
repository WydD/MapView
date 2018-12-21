import { types as t } from 'mobx-state-tree'
import { ElasticsearchGeoGridType } from '../typings'
import { LOG_COLOR_REQUEST } from './constants'
import { mapToGeodataModel } from '../lib/conversions'
import Worker from 'worker-loader!../lib/fetcher.worker'

const endpoint = process.env.SERVER || `http://researchalps.data-publica.com/api/`
const devEndpoint = 'http://researchalps-dev.data-publica.com/api/'

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

  return {
    fetchGeodataByQuery: async (query: string) => {
      const url = `${devEndpoint}structures/search/georesults`
      const ret: any = await fetchData(url, 'georesults', 'post', { query })
      const latlondata = mapToGeodataModel(ret.data.results)
      return latlondata
    },

    fetchGeodataByBoundingBox: async (geoGrid: ElasticsearchGeoGridType) => {
      const url = `${devEndpoint}structures/search/geo/bbox`
      const ret: any = await fetchData(url, 'georesults', 'post', geoGrid)
      const latlondata = mapToGeodataModel(ret.data)
      return latlondata
    },

    fetchDefaultStats: async () => {
      const url = `${devEndpoint}stats/`
      const ret: any = await fetchData(url, 'stats', 'get')
      const stats = ret.data
      return stats
    },

    fetchStructureSuggestions: async (searchKey: string) => {
      const url = `${devEndpoint}structures/search/geo/label?size=10&query=${searchKey}`
      const ret: any = await fetchData(url, 'autosuggest', 'post')
      return ret.data
    },

    fetchStructureById: async (id: string) => {
      const url = `${devEndpoint}structures/search/geo/id/${id}`
      const ret: any = await fetchData(url, 'structure', 'post')
      return ret.data
    },

    fetchStructuresByPolygon: async (polygon: number[][]) => {
      const url = `${devEndpoint}structures/search/geo/polygon`
      const _polygon = polygon.map(point => ({ lat: point[1], lon: point[0] }))
      const ret: any = await fetchData(url, 'structure', 'post', _polygon)
      return ret.data
    },

    fetchStructuresByRadius: async (center: [number, number], radiusInKm: number) => {
      const url = `${devEndpoint}structures/search/geo/distance`
      const ret: any = await fetchData(url, 'structure', 'post', {
        center: { lon: center[0], lat: center[1] },
        distance: `${radiusInKm}km`,
      })
      return ret.data
    },
  }
})
