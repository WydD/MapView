import { types as t, flow, getRoot } from 'mobx-state-tree'
import { StateType } from './state'

const SuggestionModel = t.model('SuggestionModel', {
  id: t.identifier,
  label: t.string,
})

type SuggestionType = typeof SuggestionModel.Type

export const AutocompleteModel = t
  .model('AutocompleteModel', {
    isVisible: t.boolean,
    currentValue: t.string,
    isLoading: t.boolean,
    suggestions: t.array(SuggestionModel),
  })
  .actions(self => {
    const setVisibility = (state: boolean): void => {
      self.isVisible = state
    }

    const toggleVisibility = (): void => {
      self.isVisible = !self.isVisible
    }

    const close = (): void => {
      self.isVisible = false
    }

    const setCurrentValue = (newValue: string): void => {
      self.currentValue = newValue
    }

    const setLoading = (state: boolean) => {
      self.isLoading = state
    }

    const setSuggestions = (suggestions: SuggestionType[]): void => {
      self.suggestions.replace(suggestions)
    }

    const getMatchingStructures = (newSuggestions: SuggestionType[]) => {
      const escapedValue = escapeRegexCharacters(self.currentValue.trim())

      if (escapedValue === '') {
        return []
      }

      const regex = new RegExp(`^${escapedValue}`, 'i')
      return newSuggestions.filter(suggestion => regex.test(suggestion.label))
    }

    return {
      setVisibility,
      toggleVisibility,
      close,
      setCurrentValue,
      setLoading,
      setSuggestions,
      getMatchingStructures,
    }
  })
  .actions(self => {
    const fetchSuggestions = () => {
      return flow(function * loadData() {
        const { api }: StateType = getRoot(self)

        self.isLoading = true
        try {
          const newSuggestions = yield api.fetchStructureSuggestions(self.currentValue)

          const _newSuggestions = (newSuggestions as any).map((s: any) => ({
            id: s.id,
            label: s.label,
          }))

          self.suggestions.replace(self.getMatchingStructures(_newSuggestions))
          self.isLoading = false
        } catch (error) {
          console.error(error)
          self.isLoading = false // should be error
        }
      })()
    }

    return {
      fetchSuggestions,
    }
  })

export type AutocompleteType = typeof AutocompleteModel.Type

function escapeRegexCharacters(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
