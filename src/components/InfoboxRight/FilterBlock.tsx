import React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../../state/state'
import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'
import { createSliderWithTooltip, Range as SliderRange } from 'rc-slider'

const Range = createSliderWithTooltip(SliderRange)

interface Props extends Statable {
  type: string
  typeLabel: string
}

@inject('globalState')
@observer
export class FilterBlock extends React.Component<Props> {
  componentDidMount() {}

  updateFilteredStructures = (newBounds: number[]) => {
    const { type, globalState } = this.props
    const { filters, selection } = globalState
    filters.updateActiveRangeBounds(type, newBounds)
    selection.setFilteredStructuresByBounds()
  }

  render() {
    const { type, typeLabel, globalState } = this.props
    const filter = globalState.filters[type]
    const bounds = filter.bounds
    const activeBounds = filter.activeBounds

    return (
      <div className="flex flex-column mv2">
        <div className="flex items-center pointer mb2">
          <div className="ttu fw3 f7">amount of {typeLabel}</div>
        </div>

        <div className="mt0 mb3 center relative" style={{ width: '97%' }}>
          <Range
            min={bounds[0]}
            max={bounds[1]}
            marks={{ 0: '0', [bounds[1]]: bounds[1].toString() }}
            tipFormatter={(value: number) => `${value}`}
            disabled={bounds[1] === 0}
            defaultValue={activeBounds}
            onChange={this.updateFilteredStructures}
          />
        </div>
      </div>
    )
  }
}
