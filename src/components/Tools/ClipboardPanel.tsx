import React from 'react'
import { inject, observer } from 'mobx-react'
import { ReactComponent as CopyToClipboardSvg } from 'images/copy-to-clipboard.svg'
import { Statable } from '../../state/state'
import { PanelToggle } from './PanelToggle'
import { Clipboard } from './Clipboard'

interface Props extends Statable {
  map: any
}

@inject('globalState')
@observer
export class ClipboardPanel extends React.Component<Props> {
  state = {}

  toggleCopyToClipboardPanel = (event: React.MouseEvent) => {
    event.preventDefault()
    const { clipboardPanel, geocoderPanel, autocomplete } = this.props.globalState
    clipboardPanel.toggle()

    if (clipboardPanel.state) {
      autocomplete.setVisibility(false)
      geocoderPanel.close()
    }
  }

  render() {
    const { map, globalState } = this.props
    const {
      clipboardPanel: { state: isVisible },
    } = globalState

    return (
      <div className="flex relative">
        <PanelToggle
          onClick={this.toggleCopyToClipboardPanel}
          classNames="br2 ba br--bottom hover-bg-secondary transition"
          isActive={isVisible}
          icon={<CopyToClipboardSvg className="w-100" />}
          hintLabel="Save/restore research"
        />
        {map && <Clipboard map={map} />}
      </div>
    )
  }
}
