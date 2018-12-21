import React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../../state/state'
import { Hint } from './Hint'

interface Props extends Statable {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  classNames: string
  icon: any
  hintLabel: string
  isActive: boolean
}

@inject('globalState')
@observer
export class PanelToggle extends React.Component<Props> {
  state = {
    isHintVisible: false,
  }

  showHint = (event: React.MouseEvent) => {
    this.setState({ isHintVisible: true })
  }

  hideHint = (event: React.MouseEvent) => {
    this.setState({ isHintVisible: false })
  }

  render() {
    const { onClick, classNames, icon, hintLabel, isActive } = this.props
    const { isHintVisible } = this.state
    return (
      <button
        onClick={onClick}
        onMouseEnter={this.showHint}
        onMouseLeave={this.hideHint}
        className={`selectionToggle ${classNames} pointer w-40p h-40p b--catalina-blue bg-white pa0 flex flex-center outline-0 ${
          isActive ? 'selectionToggle--is-active' : ''
        }`}
      >
        {icon}
        <Hint labelTitle={hintLabel} labelBody="" shouldAppear={isHintVisible && !isActive} />
      </button>
    )
  }
}
