import React from 'react'
import { inject, observer } from 'mobx-react'
import { BOX_SHADOW } from '../lib/constants'
import { Statable } from '../state/state'

interface Props extends Statable {
  mapboxDrawObject: any
}

@inject('globalState')
@observer
export class ClearBtn extends React.Component<Props> {
  clearSelection = (event: React.MouseEvent) => {
    event.preventDefault()
    const { globalState, mapboxDrawObject } = this.props
    const {
      selection,
      infoboxRight,
      autocomplete,
      geocoderPanel,
      clipboardPanel,
      toolSelection,
    } = globalState

    selection.clearStructures()
    infoboxRight.close()
    mapboxDrawObject.deleteAll()
    geocoderPanel.close()
    clipboardPanel.close()
    autocomplete.setVisibility(false)
    toolSelection.emptySelections()
  }

  render() {
    const { structures } = this.props.globalState.selection

    return (
      structures.length > 0 && (
        <div
          className={`pointer flex flex-center bg-white pa3 br2 mb3 ba b--cerulean no-underline f7 normal c-cerulean hover-accent ${
            structures.length > 0 ? 'clear-btn--is-open' : 'clear-btn'
          }`}
          style={{
            borderWidth: '2px',
            boxShadow: BOX_SHADOW,
          }}
          onClick={this.clearSelection}
        >
          <span className="f6">&#10005;</span>
          <span className="ml3">CLEAR CURRENT SELECTION</span>
        </div>
      )
    )
  }
}
