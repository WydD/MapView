import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../../state/state'
import { ModeLabelEnumType } from '../../state/tool-selection'
import { Hint } from './Hint'

interface Props extends Statable {
  type: ModeLabelEnumType
  addedClasses?: string
  icon: React.ReactChild
  mapboxDraw?: any
  hintLabelTitle: string
  hintLabelBody: string
}

@inject('globalState')
@observer
export class SelectionToggle extends React.Component<Props> {
  state = {
    isHintVisible: false,
  }

  componentDidMount() {
    this.setMode(this.props.globalState.toolSelection.modeLabel)
  }

  showHint = (event: React.MouseEvent) => {
    this.setState({ isHintVisible: true })
  }

  hideHint = (event: React.MouseEvent) => {
    this.setState({ isHintVisible: false })
  }

  onClick = (event: React.MouseEvent) => {
    event.preventDefault()
    const { globalState, type } = this.props
    const { closeAllPanels } = globalState
    this.setMode(type)
    closeAllPanels()
  }

  setMode(type: ModeLabelEnumType) {
    const { mapboxDraw, globalState } = this.props
    const { toolSelection } = globalState

    // if there is anything to delete
    if (mapboxDraw.getAll().features.length) {
      mapboxDraw.deleteAll(type)
    }
    toolSelection.setMode(type)
    mapboxDraw.changeMode(type)
  }

  render() {
    const { icon, addedClasses, hintLabelTitle, hintLabelBody } = this.props
    const { isHintVisible } = this.state

    return (
      <button
        onClick={this.onClick}
        onMouseEnter={this.showHint}
        onMouseLeave={this.hideHint}
        className={`w-40p h-40p b--catalina-blue bg-white pa0 relative flex flex-center ${addedClasses} outline-0 pointer`}
      >
        {icon}

        <Hint labelTitle={hintLabelTitle} labelBody={hintLabelBody} shouldAppear={isHintVisible} />
      </button>
    )
  }
}
