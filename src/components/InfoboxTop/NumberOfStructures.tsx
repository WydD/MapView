import React from 'react'
import { inject, observer } from 'mobx-react'
import { ReactComponent as SingleStructure } from 'images/single-structure.svg'
import { ReactComponent as MultipleStructures } from 'images/multiple-structures.svg'
import { Statable } from '../../state/state'

interface Props extends Statable {}

@inject('globalState')
@observer
export class NumberOfStructures extends React.Component<Props> {
  render() {
    const { structures } = this.props.globalState.selection
    const singleSelection = structures.length === 1
    const showTooltip = structures.length === 1 && structures[0].content.label.length > 36

    if (structures.length) {
      this.props.globalState.infoboxRight.toggle();
    }
    const singleStructure = {
      icon: <SingleStructure style={{ width: '18px' }} />,
      label: (structures[0] && structures[0].content.label) || '',
    }
    const multipleStructures = {
      icon: <MultipleStructures style={{ width: '18px' }} />,
      label: `${structures.length} Structures`,
    }

    if (structures.length > 0) {
      return (
        <div className="flex flex-center b f7 mv0 dib" style={{ flexBasis: '300px' }}>
          {singleSelection ? singleStructure.icon : multipleStructures.icon}
          <p
            className="w12r w9r-t ml3 truncate relative"
            data-tooltip={showTooltip ? structures[0].content.label : null}
          >
            {singleSelection ? singleStructure.label : multipleStructures.label}
          </p>
        </div>
      )
    }
    return null
  }
}
