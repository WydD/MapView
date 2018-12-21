import { types as t, getRoot } from 'mobx-state-tree'
import { LatLngType } from 'src/typings'

export const MapModel = t
  .model('Map', {
    zoom: t.number,
    center: t.array(t.number),
  })
  .actions(self => {
    const setZoom = (zoom: number) => {
      self.zoom = zoom
    }

    const setCenter = (center: LatLngType) => {
      self.center.replace([center.lng, center.lat])
    }
    return {
      setZoom,
      setCenter,
    }
  })
  .actions(self => {
    const setCenterAndZoom = (center: LatLngType, zoom: number) => {
      self.setZoom(zoom)
      self.setCenter(center)
    }

    return {
      setCenterAndZoom,
    }
  })

export type MapType = typeof MapModel.Type
