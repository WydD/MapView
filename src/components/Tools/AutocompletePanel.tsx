import React from 'react'
import { inject, observer } from 'mobx-react'
import { ReactComponent as AutocompleteIcon } from 'images/autocomplete.svg'
import { Autocomplete } from './Autocomplete'
import { PanelToggle } from './PanelToggle'
import { Statable } from '../../state/state'

interface Props extends Statable {
  map: any
}

@inject('globalState')
@observer
export class AutocompletePanel extends React.Component<Props> {
  toggleAutocompletePanel = (event: React.MouseEvent) => {
    event.preventDefault()
    const { autocomplete, geocoderPanel, clipboardPanel } = this.props.globalState
    autocomplete.toggleVisibility()

    if (autocomplete.isVisible) {
      geocoderPanel.close()
      clipboardPanel.close()
    }
  }

  render() {
    const { globalState } = this.props
    const {
      autocomplete: { isVisible },
    } = globalState

    return (
      <div className="flex relative">
        <PanelToggle
          onClick={this.toggleAutocompletePanel}
          classNames="ba br2 br--top hover-bg-secondary transition"
          isActive={isVisible}
          icon={<AutocompleteIcon className="w-100" />}
          hintLabel="Search by structure"
        />
        <Autocomplete map={this.props.map} />
      </div>
    )
  }
}
