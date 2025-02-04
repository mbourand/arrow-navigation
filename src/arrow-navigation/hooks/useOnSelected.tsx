import { useEffect } from 'react'
import { EventHandlers } from '../EventManager'
import { useShallow } from 'zustand/shallow'
import { useArrowNavigationStore } from '../store'

export const useOnFocus = (callback: NonNullable<EventHandlers['onElementFocused']>[number]) => {
  const { eventManager } = useArrowNavigationStore(useShallow(({ eventManager }) => ({ eventManager })))

  useEffect(() => {
    eventManager.on('onElementFocused', callback)
    return () => eventManager.off('onElementFocused', callback)
  }, [callback, eventManager])
}
