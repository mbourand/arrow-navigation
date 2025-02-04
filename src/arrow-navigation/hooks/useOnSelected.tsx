import { useEffect } from 'react'
import { EventHandlers } from '../EventManager'
import { useShallow } from 'zustand/shallow'
import { useArrowNavigationStore } from '../store'

export const useOnFocus = (callback: EventHandlers['onElementFocused']) => {
  const { eventManager } = useArrowNavigationStore(useShallow(({ eventManager }) => ({ eventManager })))

  useEffect(() => {
    const abortController = new AbortController()
    eventManager.on('onElementFocused', callback, abortController.signal)

    return () => abortController.abort()
  }, [callback, eventManager])
}
