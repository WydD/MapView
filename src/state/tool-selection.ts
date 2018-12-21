import { types as t } from 'mobx-state-tree'
import { ToolSelectionType } from 'src/typings'

const ModeLabelEnum = t.enumeration('ToolType', ['simple_select', 'draw_radius', 'draw_polygon'])

export type ModeLabelEnumType = typeof ModeLabelEnum.Type

const Selection = t.model('Selection', { modeLabel: ModeLabelEnum, value: t.frozen() })

export const ToolSelectionModel = t
  .model('ToolSelectionModel', {
    modeLabel: ModeLabelEnum,
    saved: t.maybeNull(Selection),
    current: t.maybeNull(Selection),
  })
  .actions(self => {
    const setMode = (mode: ModeLabelEnumType) => {
      self.modeLabel = mode
    }

    const setSavedSelection = (toolSelection: ToolSelectionType) => {
      self.saved = toolSelection
    }

    const setCurrentSelection = (toolSelection: ToolSelectionType) => {
      self.current = toolSelection
    }

    const emptySelections = () => {
      self.saved.value = {}
      self.current.value = {}
    }

    return {
      setMode,
      setSavedSelection,
      setCurrentSelection,
      emptySelections,
    }
  })

export type ToolSelectionType = typeof ToolSelectionModel.Type
