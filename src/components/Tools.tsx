import React from 'react'
import { GeocoderPanel } from './Tools/GeocoderPanel'
import { ClipboardPanel } from './Tools/ClipboardPanel'
import { Selections } from './Tools/Selections'
import { Zoom } from './Tools/Zoom'
import { AutocompletePanel } from './Tools/AutocompletePanel'

interface Props {
  mapObject: any
  mapboxDrawObject: any
}

export class Tools extends React.Component<Props> {
  render() {
    return (
      <div className="absolute flex flex-column flex-center pa3 z-5">
        <div className="mb3">
          <AutocompletePanel map={this.props.mapObject} />
          <GeocoderPanel map={this.props.mapObject} />
          <ClipboardPanel map={this.props.mapObject} />
        </div>

        <Selections mapboxDraw={this.props.mapboxDrawObject} />
        <Zoom map={this.props.mapObject} />
      </div>
    )
  }
}
