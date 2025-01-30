import { useCallback, useEffect, useRef } from 'react'
import { SelectableGroupType, SelectableType } from '../types'
import { useArrowNavigationStore } from '../store'
import { useShallow } from 'zustand/shallow'

export const useSelectableGroup = (group: SelectableGroupType) => {
  const { registerSelectableGroup, unregisterSelectableGroup } = useArrowNavigationStore(useShallow((state) => state))

  useEffect(() => {
    registerSelectableGroup(group)
    return () => unregisterSelectableGroup(group.id)
  }, [group, registerSelectableGroup, unregisterSelectableGroup])

  const { eventManager } = useArrowNavigationStore(useShallow(({ eventManager }) => ({ eventManager })))

  const childrenIds = useRef<string[]>([])

  const onElementRegistered = useCallback(
    (selectable: SelectableType) => {
      if (selectable.groupId === group.id) childrenIds.current.push(selectable.id)
    },
    [group.id]
  )

  const onElementUnregistered = useCallback((elementId: string) => {
    if (childrenIds.current.find((childId) => childId === elementId))
      childrenIds.current = childrenIds.current.filter((childId) => childId !== elementId)
  }, [])

  useEffect(() => {
    eventManager.on('elementRegistered', onElementRegistered)
    eventManager.on('elementUnregistered', onElementUnregistered)
    return () => {
      eventManager.off('elementRegistered', onElementRegistered)
      eventManager.off('elementUnregistered', onElementUnregistered)
    }
  }, [eventManager, onElementRegistered, onElementUnregistered])
}
