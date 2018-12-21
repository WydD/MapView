import React from 'react'
import { inject, observer } from 'mobx-react'
import { ReactComponent as SelectionDotsIcon } from 'images/selection-dots.svg'
import { ReactComponent as SelectionPolygonIcon } from 'images/selection-polygon.svg'
import { ReactComponent as SelectionCircleIcon } from 'images/selection-circle.svg'
import { SelectionToggle } from './SelectionToggle'
import { Statable } from '../../state/state'

interface Props extends Statable {
  mapboxDraw: any
}

@inject('globalState')
@observer
export class Selections extends React.Component<Props> {
  render() {
    const { globalState } = this.props
    const {
      toolSelection: { modeLabel },
    } = globalState

    return (
      <div className="mb3">
        <SelectionToggle
          mapboxDraw={this.props.mapboxDraw}
          icon={
            <SelectionDotsIcon
              className={`selectionToggle w-100 h-100${
                modeLabel === 'simple_select' ? ' selectionToggle--is-active' : ''
              }`}
            />
          }
          type="simple_select"
          addedClasses="ba br2 br--top"
          hintLabelTitle="Simple selection"
          hintLabelBody="Keep the &quot;M&quot; key pressed to select more"
        />
        <SelectionToggle
          mapboxDraw={this.props.mapboxDraw}
          icon={
            <SelectionPolygonIcon
              className={`selectionToggle w-100 h-100${
                modeLabel === 'draw_polygon' ? ' selectionToggle--is-active' : ''
              }`}
            />
          }
          type="draw_polygon"
          addedClasses="bl br bt-0 bb-0"
          hintLabelTitle="Polygon selection"
          hintLabelBody="Click on the map to put polygon points"
        />
        <SelectionToggle
          mapboxDraw={this.props.mapboxDraw}
          icon={
            <SelectionCircleIcon
              className={`selectionToggle w-100 h-100${
                modeLabel === 'draw_radius' ? ' selectionToggle--is-active' : ''
              }`}
            />
          }
          type="draw_radius"
          addedClasses="ba br2 br--bottom"
          hintLabelTitle="Radius selection"
          hintLabelBody="Click on the map to choose center and radius"
        />
      </div>
    )
  }
}
