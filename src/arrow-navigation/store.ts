import { create } from 'zustand'
import { SelectableGroupType, SelectableType } from './types'
import { ArrowNavigationEventManager } from './EventManager'

export type ArrowNavigationStoreType = {
  registerSelectable: (selectable: SelectableType) => void
  unregisterSelectable: (id: string) => void
  registerSelectableGroup: (group: SelectableGroupType) => void
  unregisterSelectableGroup: (id: string) => void
  eventManager: ArrowNavigationEventManager
}

export const useArrowNavigationStore = create<ArrowNavigationStoreType>((set, get) => ({
  registerSelectable: (selectable) => {
    get().eventManager.emit('elementRegistered', selectable)
  },
  unregisterSelectable: (id) => {
    get().eventManager.emit('elementUnregistered', id)
  },
  registerSelectableGroup: (group) => {
    get().eventManager.emit('groupRegistered', group)
  },
  unregisterSelectableGroup: (id) => {
    get().eventManager.emit('groupUnregistered', id)
  },
  eventManager: new ArrowNavigationEventManager(),
}))
