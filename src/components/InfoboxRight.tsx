import React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../state/state'
import { SelectionPreview } from './InfoboxRight/SelectionPreview'
import { FiltersSelection } from './InfoboxRight/FiltersSelection'
import { ResultsList } from './InfoboxRight/ResultsList'

interface Props extends Statable {}

@inject('globalState')
@observer
export class InfoboxRight extends React.Component<Props> {
  render() {
    const {
      infoboxRight: { state: isOpen },
    } = this.props.globalState
    return (
      <aside
        className={`filters-panel bg-white ph4 pv3 ${
          !isOpen ? '' : 'filters-panel--is-open'
        } c-dark overflow-x-hidden overflow-y-auto`}
      >
        <SelectionPreview />
        <FiltersSelection />
        <ResultsList />
      </aside>
    )
  }
}
