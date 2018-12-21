import * as React from 'react'
import { inject, observer } from 'mobx-react'
import Autosuggest from 'react-autosuggest'
import { reaction } from 'mobx'
import { Statable } from '../../state/state'
import { autocompleteZoom } from '../../lib/map-config'

interface Props extends Statable {
  map: any
}

interface AutosuggestValueType {
  value: string
}

interface AutosuggestNewValueType {
  newValue: string
}

interface LocalState {
  value: string
  suggestions: any[]
  isLoading: boolean
  isFocused: boolean
}

interface SuggestionType {
  label: string
  id: string
}

function getSuggestionValue(suggestion: SuggestionType) {
  return suggestion.label
}

function renderSuggestion(suggestion: SuggestionType) {
  return <span>{suggestion.label}</span>
}

@inject('globalState')
@observer
export class Autocomplete extends React.Component<Props, LocalState> {
  constructor(props: any) {
    super(props)

    this.state = {
      value: '',
      suggestions: [],
      isLoading: false,
      isFocused: false,
    }
  }

  componentDidMount() {
    reaction(this.reactToSelectedStructuresIdChange(), () => this.flyToPoint())
  }

  flyToPoint = () => {
    const {
      map,
      globalState: {
        selection: { structures },
      },
    } = this.props
    if (structures.length && structures.length === 1) {
      const { lat, lon } = structures[0].content
      const zoom = map.getZoom() > autocompleteZoom ? map.getZoom() : autocompleteZoom
      map.flyTo({ center: [lon, lat], zoom }) // lat, lon
    }
  }

  reactToSelectedStructuresIdChange() {
    return () => this.props.globalState.selection.selectedStructuresIds
  }

  onChange = (event: React.ChangeEvent, { newValue }: AutosuggestNewValueType) => {
    const { globalState } = this.props
    globalState.autocomplete.setCurrentValue(newValue)
  }

  onSuggestionsFetchRequested = ({ value }: AutosuggestValueType) => {
    this.props.globalState.autocomplete.fetchSuggestions()
  }

  onSuggestionsClearRequested = () => {
    const { setSuggestions } = this.props.globalState.autocomplete
    setSuggestions([])
  }

  onSuggestionSelected = (event: any, data: any) => {
    const {
      globalState: { setNewMultiSelection },
    } = this.props
    setNewMultiSelection([data.suggestion.id], { replace: true })
  }

  onFocus = () => {
    this.setState({isFocused: true})
  }

  onBlur = () => {
    this.setState({isFocused: false})
  }

  render() {
    const { globalState } = this.props
    const { isVisible, suggestions, isLoading, currentValue } = globalState.autocomplete

    const inputProps = {
      placeholder: 'ENTER STRUCTURE NAME',
      value: currentValue,
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur
    }

    const status = isLoading ? 'Loading suggestions...' : 'Type to search'

    return (
      isVisible && (
        <div
          className="autosuggest absolute pt2 ph2 z-3 bg-white f5 c-dark"
          style={{ top: '0', left: '50px', width: '320px' }}
        >
          <div>
            {!globalState.isGeorequestPending ? (
              <>
                <div className="ttu f7">Search and select a specific structure</div>
                <div className="ba b-dark-transparent ph2 mt1 mb1">
                  <span
                    className="autosuggest-icon-search dib"
                    style={{ width: '13px', height: '13px' }}
                  />
                  <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={this.onSuggestionSelected}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                  />
                </div>
                { (suggestions.length === 0 || !this.state.isFocused) && 
                  <div className="status tr mb1 f7 c-dark-transparent">
                    <strong>Status:</strong> {status}
                  </div>
                }
              </>
            ) : (
              <span className="f6 db pt2 pb3">Please, wait until map data is fully loaded</span>
            )}
          </div>          
        </div>
      )
    )
  }
}
