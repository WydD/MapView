import React from 'react'
import { inject, observer } from 'mobx-react'
import { ReactComponent as PlusIcon } from 'images/plus.svg'
import { ReactComponent as MinusIcon } from 'images/minus.svg'
import { Statable } from '../../state/state'
import { mapStyles } from '../../lib/map-config'

interface Props extends Statable {
  map: any
}

interface LocalState {
  warningIsVisible: boolean
  warningText: string
  isTouch: boolean
}

interface WindowExtended extends Window {
  Modernizr: any
}

@inject('globalState')
@observer
export class Zoom extends React.Component<Props, LocalState> {
  state = {
    warningIsVisible: false,
    warningText: '',
    isTouch: false,
  }

  componentDidMount() {
    const isTouch = (window as WindowExtended).Modernizr.touchevents
    this.setState({ isTouch })
  }

  private increaseZoom = () => {
    const { map } = this.props
    map.zoomTo(map.getZoom() + 1)
  }

  private decreaseZoom = () => {
    const { map } = this.props
    map.zoomTo(map.getZoom() - 1)

    if (this.state.isTouch) {
      this.showWarnings()
    }
  }

  showWarnings = () => {
    const { map } = this.props
    const zoom = map.getZoom()

    if (zoom >= mapStyles.minZoom && zoom <= mapStyles.zoom) {
      // mild or big warning
      this.setState({
        warningIsVisible: true,
        warningText:
          zoom === mapStyles.minZoom
            ? "Zoom out below this point is disabled as there would be too many data on the map, and you won't be able to navigate"
            : 'WARNING: around 50.000 points may be displayed, it may take a while',
      })

      if (this.state.isTouch) {
        setTimeout(() => this.setState({ warningIsVisible: false }), 2000)
      }
    } else {
      // no warning
      this.setState({ warningIsVisible: false })
    }
  }

  hideWarnings = () => {
    this.setState({ warningIsVisible: false })
  }

  render() {
    const { warningIsVisible, warningText } = this.state
    return (
      <div className="flex flex-column justify-center relative pointer">
        <div
          className="flex flex-center bg-white ba bb-0 br2 br--top b--catalina-blue c-primary hover-bg-secondary hover-c-white transition"
          style={{ width: '1.5rem', height: '1.5rem' }}
          onClick={this.increaseZoom}
        >
          <PlusIcon style={{ width: '8px' }} />
        </div>
        <div
          className="flex flex-center bg-white ba br2 br--bottom b--catalina-blue c-primary hover-bg-secondary hover-c-white transition"
          onClick={this.decreaseZoom}
          onMouseEnter={this.showWarnings}
          onMouseLeave={this.hideWarnings}
          style={{ width: '1.5rem', height: '1.5rem' }}
        >
          <MinusIcon style={{ width: '8px' }} />
        </div>

        <div
          className={`warning ${
            warningIsVisible ? 'warning--is-visible' : ''
          } absolute bg-white left-2 pa2 top-2 ba b-dark br2 c-dark`}
          style={{ width: '240px' }}
        >
          {warningText}
        </div>
      </div>
    )
  }
}
