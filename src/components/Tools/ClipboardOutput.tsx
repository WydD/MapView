import React from 'react'
import { inject, observer } from 'mobx-react'
import { Statable } from '../../state/state'

interface Props extends Statable {}

interface LocalState {
  isTooltipVisible: boolean
}

@inject('globalState')
@observer
export class ClipboardOutput extends React.Component<Props, LocalState> {
  state = {
    isTooltipVisible: false,
  }

  createDummyTextArea(text: any) {
    let textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    return textArea
  }

  copyToClipboard = (event: React.MouseEvent) => {
    event.preventDefault()
    const {
      globalState: { getQueryFromClipboard },
    } = this.props
    const dummyTextArea = this.createDummyTextArea(getQueryFromClipboard)
    dummyTextArea.select()
    try {
      const copyResult = document.execCommand('copy')
      if (copyResult) {
        this.onTextCopied()
      }
    } catch (e) {}
    document.body.removeChild(dummyTextArea)
  }

  onTextCopied() {
    this.setState({ isTooltipVisible: true })
    setTimeout(() => {
      this.setState({ isTooltipVisible: false })
    }, 2000)
  }

  render() {
    const { isTooltipVisible } = this.state
    return (
      <div
        className="clipboardOutput pt2 ph2 mb2"
        style={{ backgroundColor: 'rgba(36, 66, 98, 0.1)' }}
      >
        <div className="pb2 bb b-dark">
          <button
            className="ttu c-dark btn relative"
            style={{ maxWidth: 190 }}
            onClick={this.copyToClipboard}
          >
            <span>COPY CURRENT CONFIGURATION TO CLIPBOARD</span>
            <div
              className={`clipboardOutputTooltip ${
                isTooltipVisible ? 'clipboardOutputTooltip--is-active' : ''
              } absolute bg-white pa2 left-100 top-0 c-dark ba b--dark pointer-events-none`}
              style={{ width: '160px', borderRadius: '4px' }}
            >
              Copied to clipboard
            </div>
          </button>
        </div>
      </div>
    )
  }
}
