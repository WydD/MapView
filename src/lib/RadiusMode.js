// Radius mode
// Source:
// https://gist.github.com/chriswhong/694779bc1f1e5d926e47bab7205fa559
// custom mapbopx-gl-draw mode that modifies draw_line_string
// shows a center point, radius line, and circle polygon while drawing
// forces draw.create on creation of second vertex
/* eslint-disable */
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import length from '@turf/length'
import CommonSelectors from '@mapbox/mapbox-gl-draw/src/lib/common_selectors'
import Constants from '@mapbox/mapbox-gl-draw/src/constants'

const modeToClone = MapboxDraw.modes.draw_line_string

// get everything from draw_line_string, which is the most similar
const RadiusMode = { ...modeToClone }

// then override some of them
RadiusMode.onMouseDown = () => false

RadiusMode.onSetup = function(opts) {
  const props = modeToClone.onSetup.call(this, opts)

  const circle = this.newFeature({
    type: 'Feature',
    properties: {
      meta: 'radius',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[0, 0]],
    },
  })
  this.addFeature(circle)

  return {
    ...props,
    circle,
  }
}

RadiusMode.clickAnywhere = function(state, e) {
  // End drawing and call onStop
  if (state.currentVertexPosition === 1) {
    state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat)
    return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.line.id] })
  }
  this.updateUIClasses({ mouse: 'add' })
  state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat)

  if (state.direction === 'forward') {
    state.currentVertexPosition += 1
    state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat)
  } else {
    state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat)
  }

  return null
}

RadiusMode.onMouseMove = function(state, e) {
  MapboxDraw.modes.draw_line_string.onMouseMove.call(this, state, e)

  const geojson = state.line.toGeoJSON()
  const center = geojson.geometry.coordinates[0]
  const radiusInKm = length(geojson)
  const circleFeature = createGeoJSONCircle(center, radiusInKm, state.line.id)

  const { setCurrentSelection } = this.globalState.toolSelection
  setCurrentSelection({ modeLabel: 'draw_radius', value: { center, radiusInKm } })

  circleFeature.properties.meta = 'radius'
  state.circle.setCoordinates(circleFeature.geometry.coordinates)
}

RadiusMode.clearSelection = function(state) {
  this.deleteFeature([state.line.id], { silent: true })
  this.deleteFeature([state.circle.id], { silent: true })
}

RadiusMode.onKeyUp = function(state, e) {
  if (CommonSelectors.isEscapeKey(e)) {
    this.clearSelection(state)
    this.changeMode(Constants.modes.SIMPLE_SELECT)
    this.changeMode('draw_radius')
  } else if (CommonSelectors.isEnterKey(e)) {
    this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.line.id] })
  }
}

// creates the final geojson point feature with a radius property
// triggers draw.create
RadiusMode.onStop = function(state) {
  this.activateUIButton()

  // check to see if we've deleted this feature
  if (this.getFeature(state.line.id) === undefined) return

  // remove last added coordinate
  state.line.removeCoordinate('0')
  if (state.line.isValid()) {
    this.deleteFeature([state.line.id], { silent: true })
    const geojson = state.line.toGeoJSON()
    const center = geojson.geometry.coordinates[0]
    const radiusInKm = parseInt(length(geojson), 10)
    this.setNewSelection(center, radiusInKm)
  } else {
    this.deleteFeature([state.line.id], { silent: true })
    this.changeMode('simple_select', {}, { silent: true })
  }
}

RadiusMode.setNewSelection = function(center, radiusInKm) {
  this.globalState.setNewCircleSelection(center, radiusInKm)
}

RadiusMode.toDisplayFeatures = function(state, geojson, display) {
  const isActiveLine = geojson.properties.id === state.line.id
  geojson.properties.active = isActiveLine ? 'true' : 'false'
  if (!isActiveLine) return display(geojson)

  // Only render the line if it has at least one real coordinate
  if (geojson.geometry.coordinates.length < 2) return null
  geojson.properties.meta = 'feature'

  // displays center vertex as a point feature
  display(
    createVertex(
      state.line.id,
      geojson.geometry.coordinates[
        state.direction === 'forward' ? geojson.geometry.coordinates.length - 2 : 1
      ],
      `${state.direction === 'forward' ? geojson.geometry.coordinates.length - 2 : 1}`,
      false,
    ),
  )

  // displays the line as it is drawn
  display(geojson)

  return null
}

export default RadiusMode

/*
 * Utils
 */
function createVertex(parentId, coordinates, path, selected) {
  return {
    type: 'Feature',
    properties: {
      meta: 'vertex',
      parent: parentId,
      coord_path: path,
      active: selected ? 'true' : 'false',
    },
    geometry: {
      type: 'Point',
      coordinates,
    },
  }
}

// create a circle-like polygon given a center point and radius
// https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js/39006388#39006388
function createGeoJSONCircle(center, radiusInKm, parentId, points = 64) {
  const coords = {
    latitude: center[1],
    longitude: center[0],
  }

  const km = radiusInKm

  const ret = []
  const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180))
  const distanceY = km / 110.574

  let theta
  let x
  let y
  for (let i = 0; i < points; i += 1) {
    theta = (i / points) * (2 * Math.PI)
    x = distanceX * Math.cos(theta)
    y = distanceY * Math.sin(theta)

    ret.push([coords.longitude + x, coords.latitude + y])
  }
  ret.push(ret[0])

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [ret, center],
    },
    properties: {
      parent: parentId,
    },
  }
}
