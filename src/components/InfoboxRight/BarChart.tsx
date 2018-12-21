import React from 'react'
import { inject, observer } from 'mobx-react'
import { scaleLinear } from 'd3-scale'
import { SelectedStructureType } from 'src/state/selected-structure'
import { sortBy } from 'lodash'
import { getStructureKey } from '../../lib/structure-keys'
import { Statable } from '../../state/state'
import { GRAY } from '../../lib/constants'

const BAR_COLOR_HIGHLIGHT = 'rgba(1, 105, 177, 0.5)'
const BAR_COLOR_DEFAULT = GRAY

interface Props extends Statable {
  type: string
  typeLabel: string
}

interface LocalState {
  isHighlighted: number
  highlight: HighlightValues
}

interface HighlightValues {
  x: number
  y: number
  width: number
  height: number
  value: number
}

@inject('globalState')
@observer
export class BarChart extends React.Component<Props, LocalState> {
  svgRef = React.createRef<SVGSVGElement>()

  state = {
    isHighlighted: -1,
    highlight: { x: 0, y: 0, width: 0, height: 0, value: 0 },
  }

  buildOnClickRect = (structure: SelectedStructureType) => (event: React.MouseEvent) => {
    const { selection } = this.props.globalState

    if (
      selection.filteredStructuresIds.length === 1 &&
      selection.filteredStructuresIds[0] === structure.id
    ) {
      selection.resetFilteredStructures()
      this.setState({ isHighlighted: -1 })
    } else {
      selection.setFilteredStructuresByClick(structure)
    }
  }

  buildOnHoverRect = (i: number, highlight: HighlightValues) => (e: React.MouseEvent) => {
    this.setState({ isHighlighted: i, highlight })
  }

  rectDefaultColor = (e: React.MouseEvent) => {
    this.setState({ isHighlighted: -1 })
  }

  render() {
    const { globalState, type, typeLabel } = this.props
    const { structures, filteredStructures } = globalState.selection
    const { isHighlighted } = this.state
    let isOver50 = false

    const barChartData = structures.map(s => ({
      id: s.id.toString(),
      content: s.content,
      value: s.content[getStructureKey(type.toLowerCase())] || 0,
    }))

    const svgWidth = 294
    const svgHeight = 150

    const ys = barChartData.length
      ? barChartData.map(d => (!Number.isNaN(d.value) ? d.value : 0))
      : [0]
    const maxY = Math.max(...ys)
    const yScale = scaleLinear()
      .domain([0, maxY])
      .range([0, svgHeight])

    let xStep = svgWidth / (barChartData.length >= 50 ? 50 : barChartData.length)
    const filteredIds: string[] = filteredStructures.map(f => f.id)
    let sorted = sortBy(barChartData, 'value').reverse()

    if (sorted.length >= 50) {
      sorted = sorted.slice(0, 50)
      isOver50 = true
    }

    const isAllEmpty = sorted.filter(d => d.value > 0).length === 0

    return (
      <div className="flex flex-column items-center mb2 relative">
        {isOver50 &&
          !isAllEmpty && (
          <div className="absolute z-1 f7 pa1 bg-white" style={{ marginTop: '1px' }}>
              Showing only the 50 results with more {typeLabel}
          </div>
        )}
        {isAllEmpty && (
          <div
            className="absolute z-1 f7 pa1 dark-transparent flex left-0 w-100 top-0"
            style={{ marginTop: '1px', height: 'calc(100% - 23px)' }}
          >
            <div className="m-auto">There are no results to display for {typeLabel}</div>
          </div>
        )}
        <svg
          className="w-100 ba b-dark-transparent"
          style={{ height: svgHeight }}
          ref={this.svgRef}
        >
          <g>
            {sorted.reverse().map((d, i) => {
              const height = yScale(d.value)
              const y = svgHeight - height
              const x = xStep * i
              const width = xStep
              const value = d.value
              return (
                <rect
                  className="pointer"
                  onClick={this.buildOnClickRect(d)}
                  onMouseEnter={this.buildOnHoverRect(i, { x, y, width, height, value })}
                  onMouseLeave={this.rectDefaultColor}
                  key={i}
                  x={x}
                  y={y}
                  width={xStep - (barChartData.length > 1 ? 1 : 0)}
                  height={height}
                  fill={filteredIds.includes(d.id) ? BAR_COLOR_HIGHLIGHT : BAR_COLOR_DEFAULT}
                  opacity={isHighlighted === i ? 1 : 0.7}
                />
              )
            })}
          </g>
        </svg>

        <p className="mv1 f7 normal">{typeLabel}</p>

        {this.state.isHighlighted > -1 && (
          <div
            className="tooltip absolute pv2 ph2 ba b-dark br2 bg-white z-5 tc f7 c-dark"
            style={{
              top: this.state.highlight.y - 36,
              left: this.state.highlight.x + this.state.highlight.width / 2,
              transform: `translate(-50%, 0)`,
            }}
          >
            {this.state.highlight.value}
          </div>
        )}
      </div>
    )
  }
}
