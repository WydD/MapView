import React from 'react'
import { inject, observer } from 'mobx-react'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import { mapboxConfig } from '../../lib/map-config'

@inject('globalState')
@observer
export class Geocoder extends React.Component {
  geocoderContainer = React.createRef()

  componentDidMount() {
    const { map: mapObject } = this.props
    this.geocoder = new MapboxGeocoder({
      accessToken: mapboxConfig.accessToken,
      placeholder: 'ENTER PLACES',
      // ISO 3166 > https://en.wikipedia.org/wiki/ISO_3166-1
      // Albania, Austria, Belgio, Bulgaria, Croazia, Danimarca, Estonia, Finlandia, Francia, Germania, Grecia, Ungheria, Islanda, Irlanda, Italia, Lettonia, Liechtenstein, Lussemburgo, Malta, Moldavia, Montenegro, Olanda, Norvegia, Polonia, Portogallo, Romania, Russia, San Marino, Serbia, Repubblica Slovacca, Slovenia, Spagna, Svezia, Svizzera, Ucraina, Gran Bretagna
      country:
        'AL,AT,BE,BG,HR,DK,EE,FI,FR,DE,GR,HU,IS,IE,IT,LV,LI,LU,MT,MD,ME,NL,NO,PL,PT,RO,RU,SM,RS,SK,SI,ES,SE,CH,UA,GB',
    })
    this.geocoderContainer.current.appendChild(this.geocoder.onAdd(mapObject))
    this.geocoder.on('result', this.close)
  }

  componentWillUnmount() {
    this.geocoder.off('result', this.close)
  }

  close = event => {
    const { geocoderPanel } = this.props.globalState
    setTimeout(() => geocoderPanel.close(), 100)
  }

  render() {
    const { state } = this.props.globalState.geocoderPanel

    return (
      <div className={`search-panel pa2 ${!state ? '' : 'search-panel--is-open'}`}>
        <p className="c-dark mt0 mb2">SEARCH AND NAVIGATE TO A SPECIFIC PLACE</p>
        <div ref={this.geocoderContainer} id="geocoderContainer" />
      </div>
    )
  }
}
