import { MapboxBoundsType, LatLonType, LatLngType } from '../typings'
import { GeodataType } from '../state/geo-data'

export function mapboxBoundsToElasticsearchGeoGrid(bounds: MapboxBoundsType) {
  const { _ne, _sw } = bounds

  return {
    topLeft: {
      lat: _ne.lat,
      lon: _sw.lng,
    },
    bottomRight: {
      lat: _sw.lat,
      lon: _ne.lng,
    },
  }
}

export function latLonToArray(coords: LatLonType): [number, number] {
  return [coords.lat, coords.lon]
}

export function latLngToArray(coords: LatLngType): [number, number] {
  return [coords.lat, coords.lng]
}

export function mapToGeodataModel(data: any) {
  const output = []
  for (let i = 0; i < data.length; ++i) {
    const d = data[i]
    if (d.lat && d.lon) {
      const g = {
        id: d.id,
        lat: d.lat,
        lon: d.lon,
      }

      output.push(g)
    }
  }
  return output as GeodataType[]
}

export function addCommas(num: number) {
  let nStr = num.toString()
  nStr += ''
  const x = nStr.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? ',' + x[1] : ''
  const rgx = /(\d+)(\d{3})/
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + '.' + '$2')
  }
  return x1 + x2
}
