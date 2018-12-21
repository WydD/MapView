import React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../../state/state'
import { BarChart } from './BarChart'

interface Props extends Statable {}

@inject('globalState')
@observer
export class Histograms extends React.Component<Props> {
  render() {
    return (
      <div className="pv3">
        <BarChart type="projects" typeLabel="Projects" />
        <BarChart type="publications" typeLabel="Publications" />
        <BarChart type="linked" typeLabel="Partners" />
        <BarChart type="children" typeLabel="Children" />
      </div>
    )
  }
}
