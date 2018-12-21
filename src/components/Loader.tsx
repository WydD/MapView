import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { BOX_SHADOW } from '../lib/constants'
import { Tools } from './Tools'
import { Statable } from '../state/state'

interface Props extends Statable {}

@inject('globalState')
@observer
export class Loader extends React.Component<Props> {
  render() {
    const { globalState } = this.props

    if (globalState.loading.state === 'done') {
      return null
    }

    const message = globalState.loading.state === 'pending' ? 'Loading more data...' : 'Error!'

    return (
      <div
        className={`fixed flex absolute--center-horizontal z-max br2 ba b--cerulean bg-white`}
        style={{
          top: '160px',
          boxShadow: BOX_SHADOW,
          borderWidth: '2px',
          width: '300px',
          height: '100px',
        }}
      >
        <p className="m-auto f5 c-cerulean pv1 ph2 ttu">{message}</p>
      </div>
    )
  }
}
