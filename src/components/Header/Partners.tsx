import React from 'react'
import { inject, observer } from 'mobx-react'
import * as unimiSrc from 'images/unimi-logo.png'
import * as mesriSrc from 'images/mesri-logo.png'
import * as sidetradeSrc from 'images/sidetrade-logo.png'
import * as unimoreSrc from 'images/unimore-logo.png'
import { Statable } from '../../state/state'

interface Props extends Statable {}

@inject('globalState')
@observer
export class Partners extends React.Component<Props> {
  render() {
    return (
      <div className="flex flex-center">
        <h3 className="f7 fw3 ttu c-catalina-blue">partners</h3>
        <div className="f2 mh4 mh2-t w4 w5r-t">
          <img src={unimiSrc} alt="UniMi logo" />
        </div>
        <div className="f2 mh4 mh2-t w4 w5r-t">
          <img src={mesriSrc} alt="MESRI logo" />
        </div>
        <div className="f2 mh4 mh2-t w4 w5r-t">
          <img src={sidetradeSrc} alt="Sidetrade logo" />
        </div>
        <div className="f2 mh4 mh2-t w4 w5r-t">
          <img src={unimoreSrc} alt="UniMoRE logo" />
        </div>
      </div>
    )
  }
}
