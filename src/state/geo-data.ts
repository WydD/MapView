import { types as t } from 'mobx-state-tree'

export const GeodataModel = t
  .model('GeodataModel', {
    id: t.identifier,
    lat: t.number,
    lon: t.number,
  })

  .views(self => {
    return {
      get datumAsGeoJSON() {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [self.lon, self.lat],
          },
          properties: {
            id: self.id,
          },
          id: self.id,
        }
      },
    }
  })

export type GeodataType = typeof GeodataModel.Type
