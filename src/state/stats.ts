import { types as t } from 'mobx-state-tree'

export const StatsModel = t.model('StatsModel', {
  structures: t.number,
  websites: t.number,
  projects: t.number,
  publications: t.number,
})

export type StatsType = typeof StatsModel.Type
