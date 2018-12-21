import { types as t } from 'mobx-state-tree'

export const PanelModel = t
  .model('PanelModel', {
    state: false,
    query: t.maybe(t.string),
  })
  .actions(self => {
    const close = (): void => {
      self.query = ''
      self.state = false
    }

    const toggle = (): void => {
      self.query = ''
      self.state = !self.state
    }

    const search = (event: React.FormEvent<HTMLInputElement>): void => {
      const query = event.currentTarget.value
      self.query = query
    }

    return {
      toggle,
      search,
      close,
    }
  })

export type PanelType = typeof PanelModel.Type
