import React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../state/state'
import { InfoboxTop } from './InfoboxTop'
import { Logo } from './Header/Logo'
import { Partners } from './Header/Partners'
import { ShareLinks } from './Header/ShareLinks'
import { ReactComponent as ShareButton } from 'images/share.svg'
import Media from 'react-media'
import { MOBILE_MEDIA_QUERY } from '../lib/constants';

interface Props extends Statable {}

@inject('globalState')
@observer
export class Header extends React.Component<Props> {
  state = {
    isActive: false,
  }

  toggleShareIcons = (event: React.MouseEvent) => {
    this.setState({ isActive: !this.state.isActive })
  }

  render() {
    const { isActive } = this.state

    return (
      <header>
        <InfoboxTop />
      </header>
    )
  }
}
