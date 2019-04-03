import { LngLatLike } from 'mapbox-gl'

/*
 * Map layers configuration
 */
import { GeodataType } from '../state/geo-data'
import { BLUE, ORANGE, GRAY } from './constants'

/*
 * Max zoom level where clusters are applied
 */
export const clusterMaxZoom = 9

/*
 * The zoom level after the autocomplete has triggered a flyTo
 */
export const autocompleteZoom = 10

/*
 * Key to keep pressed to allow multiselection
 */
export const multiselectionKeyCode = 77 // m // shift 16

export const defaultZoom = 5

/*
 * Mapbox instance configuration
 */
interface MapStyleType {
  center: LngLatLike
  zoom: number
  minZoom: number
  maxZoom: number
  scrollZoom: boolean
  dragRotate: boolean
  trackResize: boolean
  touchZoomRotate: boolean
  doubleClickZoom: boolean
  keyboard: boolean
  dragPan: boolean
}

export const mapStyles: MapStyleType = {
  center: [8, 45.8],
  zoom: defaultZoom,
  minZoom: 4,
  maxZoom: 16,
  scrollZoom: true,
  dragRotate: true,
  trackResize: true,
  touchZoomRotate: false,
  doubleClickZoom: true,
  keyboard: true,
  dragPan: true,
}

const markerWidth = 5

export function dataSourceConfig(data: any, clusterMaxZoom: number) {
  return {
    type: 'geojson',
    data: data,
    cluster: true,
    clusterRadius: 75,
    clusterMaxZoom,
  }
}

export const structuresLayerHoverOpacity = 1
export const structuresLayerDefaultOpacity = 0.7
export const structuresLayerDeselectedOpacity = 0.4

export function structuresLayerConfig() {
  return {
    id: 'structures',
    source: 'clustersData',
    type: 'circle',
    paint: {
      'circle-color': ORANGE,
      'circle-radius': markerWidth,
      'circle-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        structuresLayerHoverOpacity,
        structuresLayerDefaultOpacity,
      ],
      'circle-opacity-transition': { duration: 300 },
    },
    // When zoom out, only keeps them visible if they are
    // not part of any cluster defined in clustersLayerConfig
    filter: ['!has', 'point_count'],
  }
}

export function selectedStructuresLayerConfig() {
  return {
    id: 'selectedStructures',
    source: 'clustersData',
    type: 'circle',
    paint: {
      'circle-color': GRAY,
      'circle-radius': markerWidth,
      'circle-opacity': 1,
      'circle-opacity-transition': { duration: 300 },
    },
    // Start by not showing anything
    filter: ['in', 'id', -1],
  }
}

export function filteredStructuresLayerConfig() {
  return {
    id: 'filteredStructures',
    source: 'clustersData',
    type: 'circle',
    paint: {
      'circle-color': BLUE,
      'circle-radius': markerWidth,
      'circle-opacity': 1,
      'circle-opacity-transition': { duration: 300 },
    },
    // Start by not showing anything
    filter: ['in', 'id', -1],
  }
}

export const clustersLayerConfig = {
  id: 'clusters',
  source: 'clustersData',
  type: 'circle',
  paint: {
    'circle-color': ORANGE,
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40], // dimension based on number of items
    'circle-opacity': 0.7,
    'circle-opacity-transition': { duration: 300 },
  },
  filter: ['>=', 'point_count', 2],
}

export const clustersLabelsLayerConfig = {
  id: 'clusterLabels',
  type: 'symbol',
  source: 'clustersData',
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['Roboto Mono Regular'],
    'text-size': 12,
  },
}

/*
 * Mapbox token
 */
export const mapboxConfig = {
  accessToken:
    'pk.eyJ1IjoiYWxiZXJ0by1tYXNzYS1hY2N1cmF0IiwiYSI6ImNqMXJ0dTV2aDAwOWIyd282YmMzenJzbWcifQ.X3meMvYFbHf4AbpzLgo8KA',
}

/*
 * Map default bounds
 */
// export const DEFAULT_BOUNDS = {
//   _sw: { lng: 1.5635009765302357, lat: 42.76711488228662 },
//   _ne: { lng: 17.63649902340063, lat: 50.55177968867312 },
// }

// export const DEFAULT_BOUNDS = {
//   _sw: { lng: 2.5635009765302357, lat: 42.76711488228662 },
//   _ne: { lng: 8.63649902340063, lat: 45.55177968867312 },
// }

export const DEFAULT_BOUNDS = {
  _sw: { lng: 6, lat: 45 },
  _ne: { lng: 9, lat: 47 },
}

/*
 * Polygon styles
 * see: https://github.com/mapbox/mapbox-gl-draw/blob/master/docs/EXAMPLES.md
 */
export const selectionToolStyles = [
  // ACTIVE (being drawn)
  // line stroke
  {
    id: 'gl-draw-line',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ORANGE,
      'line-width': 2,
    },
  },
  // polygon fill
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    paint: {
      'fill-color': ORANGE,
      'fill-outline-color': ORANGE,
      'fill-opacity': 0.1,
    },
  },
  // polygon outline stroke
  // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
  {
    id: 'gl-draw-polygon-stroke-active',
    type: 'line',
    filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ORANGE,
      'line-width': 2,
    },
  },
  // vertex point halos
  {
    id: 'gl-draw-polygon-and-line-vertex-halo-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
    paint: {
      'circle-radius': 5,
      'circle-color': '#FFF',
    },
  },
  // vertex points
  {
    id: 'gl-draw-polygon-and-line-vertex-active',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
    paint: {
      'circle-radius': 3,
      'circle-color': ORANGE,
    },
  },

  // INACTIVE (static, already drawn)
  // line stroke
  /*
  {
    id: 'gl-draw-line-static',
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString'], ['==', 'mode', 'static']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': blue,
      'line-width': 30,
    },
  },
  */

  /*
  // polygon fill
  {
    id: 'gl-draw-polygon-fill-static',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
    paint: {
      'fill-color': blue,
      'fill-outline-color': blue,
      'fill-opacity': 0.1,
    },
  },
  */

  /*
  // polygon outline
  {
    id: 'gl-draw-polygon-stroke-static',
    type: 'line',
    filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': blue,
      'line-width': 3,
    },
  },
  */
]
