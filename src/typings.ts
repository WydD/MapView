export interface LatLonType {
  lat: number
  lon: number
}

export interface LatLngType {
  lat: number
  lng: number
}

export interface StructureAddress {
  country: string
  gps: LatLonType
}

export interface StructureType {
  acronyms: string[]
  address: StructureAddress
  id: string
  label: string
  country: string
  gps: LatLonType
}

export interface Structure {
  acronyms: string[]
  address: StructureAddress
  id: string
  label: string
}

export interface GeogridAsStringType {
  bottomRight: {
    lat: string
    lon: string
  }
  precision?: number
  topLeft: {
    lat: string
    lon: string
  }
}

export interface GeogridType {
  bottomRight: {
    lat: number
    lon: number
  }
  precision?: number
  topLeft: {
    lat: number
    lon: number
  }
}

export interface MapboxBoundsType {
  _sw: LatLngType
  _ne: LatLngType
}

export interface ElasticsearchGeoGridType {
  topLeft: LatLonType
  bottomRight: LatLonType
}

export interface SplitBoundingBoxType {
  rows: number
  cols: number
  from: [number, number]
  to: [number, number]
}

export interface PolygonType {
  polygon: number[][]
}

export interface CircleType {
  center: [number, number]
  radiusInKm: number
}

export interface MultiselectionType {
  ids: string[]
}

export type ToolSelectionType =
  | {
      modeLabel: 'simple_select'
      value: MultiselectionType
    }
  | {
      modeLabel: 'draw_radius'
      value: CircleType
    }
  | {
      modeLabel: 'draw_polygon'
      value: PolygonType
    }
