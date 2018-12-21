import React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../../state/state'
import { ClipboardInput } from './ClipboardInput'
import { ClipboardOutput } from './ClipboardOutput'

interface Props extends Statable {
  map: any
}

@inject('globalState')
@observer
export class Clipboard extends React.Component<Props> {
  render() {
    const { state } = this.props.globalState.clipboardPanel
    return (
      <div
        className={`clipboard-panel ${
          !state ? '' : 'clipboard-panel--is-open'
        } absolute bg-white ba z-1`}
        style={{ width: '260px', borderRadius: '4px' }}
      >
        <ClipboardOutput />
        <ClipboardInput />
      </div>
    )
  }
}
