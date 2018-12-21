import React from 'react'
import { inject, observer } from 'mobx-react'
import Media from 'react-media'
import { Statable } from '../state/state'
import { NumberOfStructures } from './InfoboxTop/NumberOfStructures'
import { Stats } from './InfoboxTop/Stats'
import { MoreInfoToggle } from './InfoboxTop/MoreInfoToggle'
import { MOBILE_MEDIA_QUERY } from '../lib/constants'

interface Props extends Statable {}

@inject('globalState')
@observer
export class InfoboxTop extends React.Component<Props> {
  render() {
    const { structures } = this.props.globalState.selection

    return (
      <div
        className={`infoboxTop flex white pa3 user-select-none items-center items-center ${
          structures.length > 0 ? 'bg-cerulean justify-between' : 'bg-catalina-blue justify-center'
        }`}
        style={{ height: '50px' }}
      >
        <NumberOfStructures />

        <Media query={MOBILE_MEDIA_QUERY}>{matches => (matches ? <Stats /> : null)}</Media>

        <MoreInfoToggle />
      </div>
    )
  }
}
