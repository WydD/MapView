import React from 'react'
import { inject, observer } from 'mobx-react'
import { ReactComponent as RightArrow } from 'images/arrow_right.svg'
import { Statable } from '../../state/state'

interface Props extends Statable {}

@inject('globalState')
@observer
export class SelectionPreview extends React.Component<Props> {
  render() {
    const { globalState } = this.props
    const {
      selection: { structures, filteredStructures },
      goToFullResultsLink,
    } = globalState

    return (
      <div className="pb1">
        <h1 className="ma0 ttu fw1 f3">selection preview</h1>
        <div className="flex justify-between items-center">
          <p className="normal f7">
            {filteredStructures.length} of {structures.length}
            {structures.length > 1 ? ' results' : ' result'}
          </p>
          <span className="ttu normal f7 c-dark">
            <a
              href={goToFullResultsLink}
              target="_blank"
              rel="external noopener nofollow"
              className="underline color-inherit hover-bold"
            >
              go to full result list{' '}
              <RightArrow style={{ height: 20, transform: 'translate(0, -1px)' }} />
            </a>
          </span>
        </div>
      </div>
    )
  }
}
