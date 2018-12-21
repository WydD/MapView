import React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../../state/state'
import { FilterBlock } from './FilterBlock'
import { ReactComponent as ShrinkIcon } from 'images/shrink.svg'
import { ReactComponent as ExpandIcon } from 'images/expand.svg'

interface Props extends Statable {}

interface LocalState {
  isExpanded: boolean
}

@inject('globalState')
@observer
export class FiltersSelection extends React.Component<Props, LocalState> {
  state = {
    isExpanded: false,
  }

  toggleFilter = (event: React.MouseEvent) => {
    event.preventDefault()
    this.setState(state => ({ isExpanded: !state.isExpanded }))
  }

  render() {
    const { structures } = this.props.globalState.selection
    const { isExpanded } = this.state

    return (
      <div
        style={{ borderColor: 'rgba(36, 66, 98, .5)' }}
        className="flex-shrink-0 flex flex-column pv3 bt bb user-select-none"
      >
        <a
          href="#0"
          className="ma0 ttu fw1 f3 c-catalina-blue no-underline"
          onClick={this.toggleFilter}
        >
          <span className="dib">filter selection</span>
          <div className="dib">
            {isExpanded ? (
              <ShrinkIcon className="ml2 c-primary" style={{ width: '17px', transform: 'translate(0, -2px)' }} />
            ) : (
              <ExpandIcon className="ml2 c-primary" style={{ width: '17px', transform: 'translate(0, -2px)' }} />
            )}
          </div>
        </a>
        {isExpanded && (
          <>
            {structures.length >= 2 ? (
              <>
                <FilterBlock type="children" typeLabel="Children" />
                <FilterBlock type="linked" typeLabel="Partners" />
                <FilterBlock type="projects" typeLabel="Projects" />
                <FilterBlock type="publications" typeLabel="Publications" />
              </>
            ) : (
              <p className="f7 mb0">To enable filters, select at least 2 structures</p>
            )}
          </>
        )}
      </div>
    )
  }
}
