import React from 'react'
import { inject, observer } from 'mobx-react'
import Media from 'react-media'
import { MOBILE_MEDIA_QUERY } from '../lib/constants'
import { Map } from './Map'
import { Header } from './Header'
import { Loader } from './Loader'
import { InfoboxRight } from './InfoboxRight'
import { Statable } from '../state/state'
import { SmallScreenWarning } from './SmallScreenWarning'

interface Props extends Statable {}
@inject('globalState')
@observer
export default class App extends React.Component<Props> {
  render() {
    return (
      <div className="vh-100 flex flex-column">
        <Header />
        <InfoboxRight />
        <Map />
        <Loader />

        <Media query={MOBILE_MEDIA_QUERY}>
          {matches => (matches ? null : <SmallScreenWarning />)}
        </Media>
      </div>
    )
  }
}
