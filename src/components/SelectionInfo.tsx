import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../state/state'
import centroid from '@turf/centroid'
import polygon from 'turf-polygon'
import content from '*.svg'
import { BOX_SHADOW } from '../lib/constants';

interface Props extends Statable {}

@inject('globalState')
@observer
export class SelectionInfo extends React.Component<Props> {
  getRadiusJSX = (center: number[], radiusInKm: number) => {
    return (
      <>
        <p className="dib mv0 mr3">
          <span className="fw1">Center:</span> {center[0]}; {center[1]}
        </p>
        <p className="dib mv0">
          <span className="fw1">Radius:</span> {radiusInKm}Km
        </p>
      </>
    )
  }

  getPolygonJSX = (center: number[], points: number) => {
    return (
      <>
        <p className="dib mv0 mr3">
          <span className="fw1">Center:</span> {center[0]}; {center[1]}
        </p>
        <p className="dib mv0">
          <span className="fw1">Points:</span> {points}
        </p>
      </>
    )
  }

  render() {
    const { globalState } = this.props
    const {
      toolSelection: { modeLabel, current },
    } = globalState

    if (current) {
      let isHidden = false
      let contents
      let _center

      if (modeLabel === 'draw_radius') {
        const { center, radiusInKm } = current.value
        _center = [0, 0]
        let _radiusInKm = 0

        if (typeof center !== 'undefined') {
          _center = [center[0].toFixed(2), center[1].toFixed(2)]
          _radiusInKm = radiusInKm.toFixed(2)
        } else {
          isHidden = true
        }

        contents = this.getRadiusJSX(_center, _radiusInKm)
      } else if (modeLabel === 'draw_polygon') {
        const { polygon: polygonCoords } = current.value
        _center = [0, 0]
        let _points = 0

        if (typeof polygonCoords !== 'undefined' && polygonCoords.length > 2) {
          const closedPolygon = [...polygonCoords, polygonCoords[0]]
          const c = centroid(polygon([closedPolygon]))
          const lat = Number(c.geometry.coordinates[0].toFixed(2))
          const lon = Number(c.geometry.coordinates[1].toFixed(2))
          _center = [lat, lon]
          _points = polygonCoords.length - 1
        }

        if (typeof polygonCoords === 'undefined') {
          isHidden = true
        }
        contents = this.getPolygonJSX(_center, _points)
      } else if (modeLabel === 'simple_select') {
        isHidden = true
      }

      if (!isHidden) {
        return (
          <div
            className="selectionInfo white bg-secondary br2 ttu pv1 ph3 f7 z-1 pointer-events-none flex justify-between w-100"
            style={{
              boxShadow: BOX_SHADOW,
            }}
          >
            {contents}
          </div>
        )
      }
      return null
    }

    return null
  }
}
