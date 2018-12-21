import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../state/state'

interface Props extends Statable {}

@inject('globalState')
@observer
export class SmallScreenWarning extends React.Component<Props> {
  state = {
    isClose: false,
  }

  close = () => {
    this.setState({ isClose: true })
  }

  render() {
    return (
      <div
        className={`mobileWarning ${
          this.state.isClose ? '' : 'mobileWarning--is-visible'
        } fixed z-max bottom-1 left-1 right-1 ba b-dark pb4 pt4 ph4 bg-white f5 lh-copy tc`}
      >
        <div
          className="mobileWarningClose absolute hover-bold pointer f4"
          style={{ top: 0, right: 8 }}
          onClick={this.close}
        >
          x
        </div>
        For optimal experience, please switch to a screen wider than 640 pixels
      </div>
    )
  }
}
