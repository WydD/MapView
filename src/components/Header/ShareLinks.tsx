import React from 'react'
import { inject, observer } from 'mobx-react'
import { ReactComponent as FacebookIcon } from 'images/facebook.svg'
import { ReactComponent as TwitterIcon } from 'images/twitter.svg'
import { ReactComponent as WebIcon } from 'images/web.svg'
import { Statable } from '../../state/state'

interface Props extends Statable {
  isActive: boolean
}

type Social = {
  name: string
  link: string
  icon: JSX.Element
}

const SOCIAL: Social[] = [
  {
    name: 'facebook',
    link: `https://www.facebook.com/hashtag/researchalps`,
    icon: <FacebookIcon className="w2 bg-white c-primary hover-accent" />,
  },
  {
    name: 'twitter',
    link: `https://twitter.com/re_alps`,
    icon: <TwitterIcon className="w2 bg-white c-primary hover-accent" />,
  },
  {
    name: 'email',
    link: `http://researchalps.eu/`,
    icon: <WebIcon className="w2 white bg-primary hover-bg-accent" />,
  },
]

@inject('globalState')
@observer
export class ShareLinks extends React.Component<Props> {
  render() {
    const { isActive } = this.props

    return (
      <div className={`flex br2`}>
        {SOCIAL.map(({ name, link, icon }: Social) => (
          <a
            key={name}
            rel="external noopener nofollow"
            target="_blank"
            href={link}
            className={`dib ${
              isActive ? `show-${name}-icons` : `hide-${name}-icons`
            } w2 h2 bg-accent absolute top-2`}
          >
            {icon}
          </a>
        ))}
      </div>
    )
  }
}
