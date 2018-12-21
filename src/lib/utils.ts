import { LatLonType } from '../typings'

type CoordinatesTuple = [number, number]

export function extentLatLonBy(coordinatesTuple: CoordinatesTuple[], accessor: string): LatLonType {
  const latitudes = coordinatesTuple.map(([lat, lon]) => lat)
  const longitudes = coordinatesTuple.map(([lat, lon]) => lon)
  return {
    lat: Math[accessor](...longitudes),
    lon: Math[accessor](...latitudes),
  }
}
