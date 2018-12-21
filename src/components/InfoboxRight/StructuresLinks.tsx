import React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../../state/state'
import { sortBy } from 'lodash'
import { ReactComponent as RightArrow } from 'images/arrow_right.svg'
import { SelectedStructureType } from 'src/state/selected-structure'

interface Props extends Statable {}

function byLabel(o: SelectedStructureType) {
  return o.content.label
}

@inject('globalState')
@observer
export class StructuresLinks extends React.Component<Props> {
  render() {
    const { structures, filteredStructures } = this.props.globalState.selection
    const filteredStructuresIds = filteredStructures.map(f => f.id)

    return (
      <>
        {sortBy(structures, byLabel).map(structure => (
          <div
            key={structure.id}
            className={`flex justify-between items-center ttu bb pa2 ${
              filteredStructuresIds.includes(structure.id)
                ? 'o-100 pointer'
                : 'o-20 pointer-events-none'
            }`}
            style={{ borderColor: '#f0f0f0' }}
          >
            <span className="f7 fw3" style={{ flexBasis: 'calc(100% - 70px)' }}>
              {structure.content.label}
            </span>
            <a
              href={`http://researchalps.data-publica.com/structure/${structure.id}`}
              target="_blank"
              rel="noopener nofollow"
              className="link c-dark tr hover-bold"
              style={{ fontSize: '9px', flexBasis: '60px' }}
            >
              explore <RightArrow style={{height: 14, transform: 'translate(0, -2px)'}} />
            </a>
          </div>
        ))}
      </>
    )
  }
}
