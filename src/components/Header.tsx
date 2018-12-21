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
        <div className="flex items-center justify-between pa3 bg-pattens-blue">
          <Logo />

          <Media query={MOBILE_MEDIA_QUERY}>
          {matches => (matches ? <Partners /> : null)}
          </Media>
          <div className="w2 h2 bg-catalina-blue br2 pointer">
            <>
              <ShareButton className="w2 white hover-accent" onClick={this.toggleShareIcons} />
              <ShareLinks isActive={isActive} />
            </>
          </div>
        </div>
        <InfoboxTop />
      </header>
    )
  }
}
