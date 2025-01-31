import { useCallback, useEffect } from 'react'
import { SelectableGroupType, SelectableType } from '../types'
import { useArrowNavigationStore } from '../store'
import { useShallow } from 'zustand/shallow'

export const useSelectableGroup = (group: SelectableGroupType) => {
  const { registerSelectableGroup, unregisterSelectableGroup, eventManager } = useArrowNavigationStore(
    useShallow((state) => state)
  )

  const onAnyElementFocused = useCallback(
    (selectable: SelectableType) => {
      if (selectable.groupId === group.id) {
        group.onElementFocused?.(selectable)
      }
    },
    [group]
  )

  const onAnyGroupLeaved = useCallback(
    (leftGroup: SelectableGroupType) => {
      if (leftGroup.id === group.id) {
        group.onGroupLeaved?.(leftGroup)
      }
    },
    [group]
  )

  useEffect(() => {
    eventManager.on('onElementFocused', onAnyElementFocused)
    eventManager.on('onGroupLeaved', onAnyGroupLeaved)
    registerSelectableGroup(group)

    return () => {
      eventManager.off('onElementFocused', onAnyElementFocused)
      eventManager.off('onGroupLeaved', onAnyGroupLeaved)
      unregisterSelectableGroup(group.id)
    }
  }, [eventManager, group, onAnyElementFocused, onAnyGroupLeaved, registerSelectableGroup, unregisterSelectableGroup])
}
