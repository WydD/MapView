import React from 'react'
import { inject, observer } from 'mobx-react'
import { SelectedStructureType } from 'src/state/selected-structure'
import { Statable } from '../../state/state'
import { StatsType } from '../../state/stats'
import { addCommas } from '../../lib/conversions'

interface Props extends Statable {}

@inject('globalState')
@observer
export class Stats extends React.Component<Props> {
  getStats() {
    const { structures } = this.props.globalState.selection

    return {
      children: this.sumByKey(structures, 'children'),
      projects: this.sumByKey(structures, 'projects'),
      linked: this.sumByKey(structures, 'linked'),
      publications: this.sumByKey(structures, 'publications'),
    }
  }

  sumByKey(data: any, key: string) {
    return data.reduce((acc: any, next: any) => acc + next.content[key], 0)
  }

  render() {
    const { defaultStats, selection } = this.props.globalState
    const { structures } = selection

    let data01 = defaultStats.structures
    let data02 = defaultStats.websites
    let data03 = defaultStats.projects
    let data04 = defaultStats.publications

    let label01 = 'Structures'
    let label02 = 'Websites'
    let label03 = 'Projects'
    let label04 = 'Publications'

    if (structures.length > 0) {
      const stats = this.getStats()

      data01 = stats.children
      data02 = stats.linked
      data03 = stats.projects
      data04 = stats.publications

      label01 = 'Children'
      label02 = 'Partners' // 'Linked Organizations'
    }

    return (
      <div className="flex space-between">
        {structures.length > 0 && <div className="statsDivider bl b--white truncate" />}

        <div className="flex flex-column-t tc-t ph4 ph3-t">
          <span className="mv0 mr2 mr0-t b f7">{addCommas(data01)}</span>
          <span className="mv0 normal f7 fw3 white">{label01}</span>
        </div>

        <div className="flex flex-column-t tc-t ph4 ph3-t">
          <span className="mv0 mr2 mr0-t b f7">{addCommas(data02)}</span>
          <span className="mv0 normal f7 fw3 white">{label02}</span>
        </div>

        <div className="flex flex-column-t tc-t ph4 ph3-t">
          <span className="mv0 mr2 mr0-t b f7">{addCommas(data03)}</span>
          <span className="mv0 normal f7 fw3 white">{label03}</span>
        </div>

        <div className="flex flex-column-t tc-t ph4 ph3-t">
          <span className="mv0 mr2 mr0-t b f7">{addCommas(data04)}</span>
          <span className="mv0 normal f7 fw3 white">{label04}</span>
        </div>

        {structures.length > 0 && <div className="statsDivider br b--white truncate" />}
      </div>
    )
  }
}
