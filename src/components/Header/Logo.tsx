import React from 'react'
import { inject, observer } from 'mobx-react'
import * as logoSrc from 'images/ra-logo.png'
import { Statable } from '../../state/state'

interface Props extends Statable {}

@inject('globalState')
@observer
export class Logo extends React.Component<Props> {
  render() {
    return (
      <a
        href="#0"
        rel="external noopener nofollow"
        target="_blank"
        className="w4 h3 flex flex-center db"
      >
        <img className="w4 w6r-t" src={logoSrc} alt="Logo" />
      </a>
    )
  }
}
