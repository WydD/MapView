import { types as t } from 'mobx-state-tree'

export const SelectedStructureModel = t.model('SelectedStructureModel', {
  id: t.identifier,
  content: t.frozen(),
})

export type SelectedStructureType = typeof SelectedStructureModel.Type
