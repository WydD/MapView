import React from 'react'
import { inject, observer } from 'mobx-react'
import { ReactComponent as GeocoderSvg } from 'images/geocoder.svg'
import { Statable } from '../../state/state'
import { PanelToggle } from './PanelToggle'
import { Geocoder } from './Geocoder'

interface Props extends Statable {
  map: any
}

@inject('globalState')
@observer
export class GeocoderPanel extends React.Component<Props> {
  toggleGeocoderPanel = (event: React.MouseEvent) => {
    event.preventDefault()
    const { clipboardPanel, geocoderPanel, autocomplete } = this.props.globalState
    geocoderPanel.toggle()

    if (geocoderPanel.state) {
      autocomplete.setVisibility(false)
      clipboardPanel.close()
    }
  }

  render() {
    const { map, globalState } = this.props
    const {
      geocoderPanel: { state: isVisible },
    } = globalState

    return (
      <div className="flex relative">
        <PanelToggle
          onClick={this.toggleGeocoderPanel}
          classNames="br bt-0 bb-0 hover-bg-secondary transition"
          isActive={isVisible}
          icon={<GeocoderSvg className="w-100" />}
          hintLabel="Search by place"
        />
        {map && <Geocoder map={map} />}
      </div>
    )
  }
}
