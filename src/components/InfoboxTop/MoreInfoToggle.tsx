import React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../../state/state'

interface Props extends Statable {}

@inject('globalState')
@observer
export class MoreInfoToggle extends React.Component<Props> {
  toggleRightInfobox = (event: any) => {
    event.preventDefault()
    this.props.globalState.infoboxRight.toggle()
  }

  render() {
    const { globalState } = this.props
    const { infoboxRight, selection } = globalState
    const isInfoboxRightOpen = infoboxRight.state
    if (selection.structures.length > 0) {
      return (
        <div className="tr" style={{ flexBasis: '300px' }}>
          <a
            href="#0"
            className={`moreInfoToggle pointer b f7 mv0 ttu inherit no-underline white ${
              infoboxRight.state ? 'moreInfoToggle--is-active' : ''
            }`}
            onClick={this.toggleRightInfobox}
          >
            <span className="moreInfoToggleText dib">more info</span>
            <div
              className={`db dn-t ml2 dib v-mid br1 hover-info-menu-accent`}
              style={{ width: '24px', height: '24px' }}
            >
              <div
                id="infobox-icon"
                className={`moreInfoToggleLines z-5 ${isInfoboxRightOpen ? 'open' : ''}`}
              >
                <span className={`bg-white`} />
                <span className={`bg-white`} />
                <span className={`bg-white`} />
              </div>
            </div>
          </a>
        </div>
      )
    }
    return null
  }
}
