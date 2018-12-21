import { SplitBoundingBoxType, ElasticsearchGeoGridType, GeogridType } from '../typings'
import { compact } from 'lodash'
import { array } from 'mobx-state-tree/dist/internal'

const latSteps = 720 // 360 // number of steps
const lonSteps = 360 // 180 // number of steps
const latRange = [90, -90]
const lonRange = [-180, 180]
const latStep = (Math.abs(latRange[0]) + Math.abs(latRange[1])) / latSteps
const lonStep = (Math.abs(lonRange[0]) + Math.abs(lonRange[1])) / lonSteps

export function getTilesIndexRange(coords: GeogridType) {
  return {
    lat: [
      getSnappedLatIndex(coords.topLeft.lat, 'ceil'),
      getSnappedLatIndex(coords.bottomRight.lat, 'floor'),
    ],
    lon: [
      getSnappedLonIndex(coords.topLeft.lon, 'floor'),
      getSnappedLonIndex(coords.bottomRight.lon, 'ceil'),
    ],
  }
}

export function getSnappedLatIndex(coord: number, type: 'ceil' | 'floor') {
  let latPos = null

  for (let i = 0; i < latSteps; ++i) {
    const currentLatCoord = latRange[0] - i * latStep
    const nextLatCoord = latRange[0] - (i + 1) * latStep
    if (coord < currentLatCoord && coord >= nextLatCoord) {
      latPos = type === 'floor' ? i + 1 : i
      break
    }
  }

  return latPos
}

export function getSnappedLonIndex(coord: number, type: 'ceil' | 'floor') {
  let lonPos = null

  for (let i = 0; i < lonSteps; ++i) {
    const currentLonCoord = lonRange[0] + i * lonStep
    const nextLonCoord = lonRange[0] + (i + 1) * lonStep
    if (coord >= currentLonCoord && coord < nextLonCoord) {
      lonPos = type === 'floor' ? i : i + 1
      break
    }
  }

  return lonPos
}

export function filterTilesByIndex(
  loadedTilesIndex: number[][],
  tilesIndexRange: { lat: number[]; lon: number[] },
): number[][] {
  const { lat, lon } = tilesIndexRange
  const arr = []

  for (let i = lat[0]; i < lat[1]; ++i) {
    for (let j = lon[0]; j < lon[1]; ++j) {
      let isTile = false

      for (let k = 0; k < loadedTilesIndex.length; ++k) {
        const loadedTileIndex = loadedTilesIndex[k]
        if (loadedTileIndex[0] === i && loadedTileIndex[1] === j) {
          isTile = true
          break
        }
      }

      if (!isTile) {
        arr.push([i, j])
      }
    }
  }

  return arr
}

export function getTileCoords(index: number[]) {
  const currentLatCoord = latRange[0] - index[0] * latStep
  const nextLatCoord = latRange[0] - (index[0] + 1) * latStep
  const latPos = [currentLatCoord, nextLatCoord]

  const currentLonCoord = lonRange[0] + index[1] * lonStep
  const nextLonCoord = lonRange[0] + (index[1] + 1) * lonStep
  const lonPos = [currentLonCoord, nextLonCoord]

  return {
    topLeft: {
      lat: currentLatCoord,
      lon: currentLonCoord,
    },
    bottomRight: {
      lat: nextLatCoord,
      lon: nextLonCoord,
    },
  }
}
