import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { reaction } from 'mobx'
import mapboxgl from 'mapbox-gl'
import { Tools } from './Tools'
import { ClearBtn } from './ClearBtn'
import { SelectionInfo } from './SelectionInfo'
import { Statable } from '../state/state'
import {
  mapboxConfig,
  mapStyles,
  dataSourceConfig,
  structuresLayerConfig,
  filteredStructuresLayerConfig,
  selectedStructuresLayerConfig,
  clustersLayerConfig,
  clustersLabelsLayerConfig,
  clusterMaxZoom,
  multiselectionKeyCode,
  structuresLayerDefaultOpacity,
  structuresLayerDeselectedOpacity,
  selectionToolStyles,
} from '../lib/map-config'
import { debounce } from 'lodash'
import RadiusMode from '../lib/RadiusMode'
import { drawPolygonOnMouseMove } from '../lib/PolygonModeOverride'
const MapboxDraw = require('@mapbox/mapbox-gl-draw')

interface Props extends Statable {}

interface LocalState {
  map: any
  mapboxDraw: any
  isHoverStructure: boolean
  isMultiselectionKeyPressed: boolean
}

mapboxgl.accessToken = mapboxConfig.accessToken

const DEBOUNCE_TIME = 100

@inject('globalState')
@observer
export class Map extends React.Component<Props, LocalState> {
  mapRef = React.createRef<HTMLDivElement>()
  hoveredStateId: number = null

  constructor(props: any) {
    super(props)
    this.state = {
      map: null,
      mapboxDraw: null,
      isHoverStructure: false,
      isMultiselectionKeyPressed: false,
    }
  }

  componentDidMount() {
    this.initMap()
  }

  initMap() {
    const { globalState } = this.props

    // initialize map
    const map = new mapboxgl.Map({
      ...mapStyles,
      container: this.mapRef.current.id,
      style: 'mapbox://styles/pietroguinea/cjl6fw7el0qjb2so034jw7xvu',
    })

    // initialize radius drawing mode
    RadiusMode.globalState = globalState

    const mapboxDraw = new MapboxDraw({
      defaultMode: 'simple_select',
      displayControlsDefault: false,
      styles: [...selectionToolStyles],
    })

    // add radius mode
    MapboxDraw.modes.draw_radius = RadiusMode

    // overrides on polygon mode
    MapboxDraw.modes.draw_polygon.globalState = globalState
    MapboxDraw.modes.draw_polygon.onMouseMove = drawPolygonOnMouseMove

    // disable dragging
    MapboxDraw.modes.simple_select.startOnActiveFeature = () => false
    MapboxDraw.modes.simple_select.onClick = () => false

    // disable map weird events
    map.dragRotate.disable()
    map.touchZoomRotate.disableRotation()

    // add controls for drawing on map
    map.addControl(mapboxDraw)

    // initialize children components (geocoder, zoom, selections, etc)
    this.setState({ map, mapboxDraw })

    // wait for data, then display
    map.on('draw.create', this.onPolygonSelectionDrawn)
    map.on('load', () => this.recursiveCheckData())
    map.on('mouseenter', 'structures', this.highlightStructure)
    map.on('mouseleave', 'structures', this.unhighlightStructure)

    // update global storage
    globalState.map.setCenterAndZoom(map.getCenter(), map.getZoom())
  }

  highlightStructure = (e: any) => {
    if (e.features.length > 0) {
      if (this.hoveredStateId) {
        this.unhighlightStructure()
      }
      this.hoveredStateId = e.features[0].id
      this.state.map.setFeatureState(
        { source: 'clustersData', id: this.hoveredStateId },
        { hover: true },
      )
    }
  }

  unhighlightStructure = () => {
    this.state.map.setFeatureState(
      { source: 'clustersData', id: this.hoveredStateId },
      { hover: false },
    )
    this.hoveredStateId = null
  }

  onPolygonSelectionDrawn = (e: any) => {
    const {
      setNewPolygonSelection,
      toolSelection: { setCurrentSelection },
    } = this.props.globalState
    const { mapboxDraw } = this.state

    const features = mapboxDraw.getAll().features
    const polygonCoords = features[0].geometry.coordinates[0]
    setNewPolygonSelection(polygonCoords)
    setCurrentSelection({
      modeLabel: 'draw_polygon',
      value: { polygon: polygonCoords },
    })
  }

  recursiveCheckData() {
    if (this.props.globalState.geodata.length > 0) {
      this.putDataOnMap()
      this.bindEvents()
      this.bindReactions()
    } else {
      setTimeout(() => this.recursiveCheckData(), 200)
    }
  }

  bindReactions() {
    reaction(this.reactToFilteredStructuresIdsChange(), () => this.updateFilteredStructuresLayer())
    reaction(this.reactToSelectedStructuresIdChange(), () => this.highlightSelectedStructures())
    reaction(this.reactToGeodataUpdate(), debounce(this.updateMapData, DEBOUNCE_TIME))
    reaction(this.reactToQueryFromClipboard(), queryFromClipboard =>
      this.recenterMap(queryFromClipboard),
    )
  }

  reactToQueryFromClipboard() {
    return () => this.props.globalState.queryFromClipboard
  }

  recenterMap = (queryFromClipboard: any) => {
    const { map } = this.state
    const { map: mapConfig } = queryFromClipboard
    map.flyTo(mapConfig)
  }

  reactToFilteredStructuresIdsChange() {
    return () => this.props.globalState.selection.filteredStructuresIds
  }

  updateSelectedStructuresLayer = () => {
    const { map } = this.state
    const {
      selection: { selectedStructuresIds },
    } = this.props.globalState
    map.setFilter('selectedStructures', ['all', ['in', 'id', ...selectedStructuresIds]])
  }

  updateFilteredStructuresLayer = () => {
    const { map } = this.state
    const { selection } = this.props.globalState
    map.setFilter('filteredStructures', ['all', ['in', 'id', ...selection.filteredStructuresIds]])
  }

  updateStructuresLayerOpacity = () => {
    const { map } = this.state
    const {
      selection: { selectedStructuresIds },
    } = this.props.globalState

    map.setPaintProperty(
      'structures',
      'circle-opacity',
      !selectedStructuresIds.length
        ? structuresLayerDefaultOpacity
        : structuresLayerDeselectedOpacity,
    )
  }

  reactToGeodataUpdate() {
    return () => this.props.globalState.geodata.map(s => s.id)
  }

  updateMapData = () => {
    const { globalState } = this.props
    this.state.map.getSource('clustersData').setData(globalState.dataAsGEOJSON)
  }

  reactToSelectedStructuresIdChange() {
    return () => this.props.globalState.selection.selectedStructuresIds
  }

  highlightSelectedStructures = () => {
    this.updateSelectedStructuresLayer()
    this.updateFilteredStructuresLayer()
    this.updateStructuresLayerOpacity()
  }

  putDataOnMap = () => {
    const { globalState } = this.props

    this.state.map
      .addSource('clustersData', dataSourceConfig(globalState.dataAsGEOJSON, clusterMaxZoom))
      .addLayer(structuresLayerConfig())
      .addLayer(selectedStructuresLayerConfig())
      .addLayer(filteredStructuresLayerConfig())
      .addLayer(clustersLayerConfig)
      .addLayer(clustersLabelsLayerConfig)
  }

  loadNewGeodata = (e: any) => {
    const { globalState } = this.props
    const { map } = this.state
    globalState.parseBoundingBoxAndFetchGeodata(this.state.map.getBounds())
    globalState.map.setCenterAndZoom(map.getCenter(), map.getZoom())
  }

  bindEvents = () => {
    this.state.map
      .on('click', 'structures', this.updateSelectedStructures)
      .on('mouseenter', 'structures', this.displayHoverCursor)
      .on('mouseleave', 'structures', this.displayDefaultCursor)
      .on('moveend', this.loadNewGeodata)
      .on('zoomend', this.loadNewGeodata)

    document.addEventListener('keydown', this.handleShiftKey, false)
    document.addEventListener('keyup', this.handleShiftKey, false)
  }

  handleShiftKey = (event: KeyboardEvent) => {
    if (event.keyCode === multiselectionKeyCode) {
      const isPressed = event.type === 'keydown'
      const hasChanged = isPressed !== this.state.isMultiselectionKeyPressed
      if (hasChanged) {
        this.setState({ isMultiselectionKeyPressed: isPressed }, () => {})
      }
    }
  }

  displayHoverCursor = () => {
    this.setState({ isHoverStructure: true })
  }

  displayDefaultCursor = () => {
    this.setState({ isHoverStructure: false })
  }

  updateSelectedStructures = (event: any) => {
    const { setNewMultiSelection } = this.props.globalState
    const { isMultiselectionKeyPressed } = this.state
    const structureId = event.features[0].id

    setNewMultiSelection([structureId], { replace: !isMultiselectionKeyPressed })
  }

  render() {
    const { isHoverStructure, map, mapboxDraw } = this.state
    const {globalState} = this.props
    const {toolSelection} = globalState
    const isPolygonOrCircle = toolSelection.modeLabel !== 'simple_select'

    if(map) {
      map.getCanvas().style.cursor = isHoverStructure || isPolygonOrCircle ? 'pointer' : 'grab'
    }

    return (
      <div
        ref={this.mapRef}
        id="map"
        className={`flex flex-column items-start h-100`}
      >
        {map && (
          <>
            <Tools mapObject={map} mapboxDrawObject={mapboxDraw} />
            <div className="fixed absolute--center-horizontal" style={{top: 160, width: 270}}>
              <ClearBtn mapboxDrawObject={mapboxDraw} />
              <SelectionInfo />
            </div>
          </>
        )}
      </div>
    )
  }
}
