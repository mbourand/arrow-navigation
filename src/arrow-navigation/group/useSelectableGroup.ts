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
    const abortController = new AbortController()
    eventManager.on('onElementFocused', onAnyElementFocused, abortController.signal)
    eventManager.on('onGroupLeaved', onAnyGroupLeaved, abortController.signal)
    registerSelectableGroup(group)

    return () => {
      abortController.abort()
      unregisterSelectableGroup(group.id)
    }
  }, [eventManager, group, onAnyElementFocused, onAnyGroupLeaved, registerSelectableGroup, unregisterSelectableGroup])
}
