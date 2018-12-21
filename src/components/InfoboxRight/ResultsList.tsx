import React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../../state/state'
import { Histograms } from './Histograms'
import { StructuresLinks } from './StructuresLinks'
interface Props extends Statable {}

@inject('globalState')
@observer
export class ResultsList extends React.Component<Props> {
  render() {
    return (
      <div className="pv3">
        <h1 className="ma0 ttu fw1 f3">results list</h1>
        <Histograms />
        <StructuresLinks />
      </div>
    )
  }
}
