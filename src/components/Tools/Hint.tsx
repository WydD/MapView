import React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../../state/state'

interface Props extends Statable {
  shouldAppear: boolean
  labelTitle: string
  labelBody?: string
}

@inject('globalState')
@observer
export class Hint extends React.Component<Props> {
  render() {
    const { shouldAppear, labelTitle, labelBody } = this.props

    return (
      <p
        className={`hint db ba br2 pv2 ph2 fixed z-4 shadow-2 bg-white c-dark mv0 ${
          shouldAppear ? 'hint--is-visible' : ''
        }`}
        style={{ pointerEvents: 'none' }}
      >
        <span className="ttu db">{labelTitle}</span>
        {labelBody && <span className="db mt1">{labelBody}</span>}
      </p>
    )
  }
}
