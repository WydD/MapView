import CommonSelectors from '@mapbox/mapbox-gl-draw/src/lib/common_selectors'
import Constants from '@mapbox/mapbox-gl-draw/src/constants'

export const drawPolygonOnMouseMove = function(state, e) {
  state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat)
  if (CommonSelectors.isVertex(e)) {
    this.updateUIClasses({ mouse: Constants.cursors.POINTER })
  }

  const {
    toolSelection: { setCurrentSelection },
  } = this.globalState

  const polygonCoords = [...state.polygon.coordinates[0]]
  setCurrentSelection({
    modeLabel: 'draw_polygon',
    value: { polygon: polygonCoords },
  })
}
