import { create } from 'zustand'
import { SelectableRegionType, SelectableType } from './types'
import { ArrowNavigationEventManager } from './EventManager'

export type ArrowNavigationStoreType = {
  registerSelectable: (selectable: SelectableType) => void
  unregisterSelectable: (id: string) => void
  registerSelectableRegion: (region: SelectableRegionType) => void
  unregisterSelectableRegion: (id: string) => void
  eventManager: ArrowNavigationEventManager
}

export const useArrowNavigationStore = create<ArrowNavigationStoreType>((set, get) => ({
  registerSelectable: (selectable) => {
    get().eventManager.emit('elementRegistered', selectable)
  },
  unregisterSelectable: (id) => {
    get().eventManager.emit('elementUnregistered', id)
  },
  registerSelectableRegion: (region) => {
    get().eventManager.emit('regionRegistered', region)
  },
  unregisterSelectableRegion: (id) => {
    get().eventManager.emit('regionUnregistered', id)
  },
  eventManager: new ArrowNavigationEventManager(),
}))
