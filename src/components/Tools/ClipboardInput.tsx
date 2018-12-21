import { inject, observer } from 'mobx-react'
import React from 'react'
import { ReactComponent as ArrowRight } from 'images/arrow_right.svg'
import { Statable } from '../../state/state'

interface Props extends Statable {}

interface LocalState {
  textAreaValue: string
  isTextAreaValueValid: boolean
  errorMsg: string
}

const GENERIC_ERROR = 'This configuration is not valid'
const JSON_FORMAT_ERROR = 'Warning! This is not a valid JSON'

@inject('globalState')
@observer
export class ClipboardInput extends React.Component<Props, LocalState> {
  state = {
    textAreaValue: '',
    isTextAreaValueValid: false,
    errorMsg: GENERIC_ERROR,
  }

  loadConfiguration = (event: React.FormEvent) => {
    event.preventDefault()
    const {
      globalState: { setQueryFromClipboard, clipboardPanel },
    } = this.props
    setQueryFromClipboard(this.state.textAreaValue)
    clipboardPanel.close()
  }

  // https://stackoverflow.com/a/3710226
  isJsonString(str: string) {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  updateConfig = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const value = event.currentTarget.value
    let isTextAreaValueValid = false

    if (this.isJsonString(value)) {
      const config = JSON.parse(value)

      if (
        config.selectedStructuresIds &&
        config.selectedStructuresIds.every((s: string[]) => typeof s === 'string') &&
        config.map &&
        config.map.zoom &&
        config.map.center &&
        config.map.center.length === 2 &&
        typeof config.map.zoom === 'number' &&
        typeof config.map.center[0] === 'number' &&
        typeof config.map.center[1] === 'number'
      ) {
        isTextAreaValueValid = true
      }
      this.setState({ errorMsg: GENERIC_ERROR })
    } else {
      this.setState({ errorMsg: JSON_FORMAT_ERROR })
    }

    this.setState({ textAreaValue: event.currentTarget.value, isTextAreaValueValid })
  }

  render() {
    const { textAreaValue, isTextAreaValueValid, errorMsg } = this.state
    return (
      <div className="ph2 pb3">
        <p className="ttu mt0 mb1 c-dark">Paste your configuration below:</p>
        <textarea
          value={textAreaValue}
          onChange={this.updateConfig}
          placeholder="PASTE HERE"
          className="w-100 db pa2"
          style={{ height: 50, resize: 'none', outline: 'none' }}
        />
        {!isTextAreaValueValid ? (
          <div className="mt2 tr mb1 c-dark-transparent">{errorMsg}</div>
        ) : (
          <button className="btn w-100 mt2 db" onClick={this.loadConfiguration}>
            <span className="db tr ">LOAD CONFIGURATION</span>
          </button>
        )}
      </div>
    )
  }
}
