import { useEffect } from 'react'
import { useArrowNavigationStore } from '../store'
import { SelectableType } from '../types'

export const useSelectable = (params: SelectableType) => {
  const { registerSelectable, unregisterSelectable } = useArrowNavigationStore((state) => state)

  useEffect(() => {
    registerSelectable(params)
    return () => unregisterSelectable(params.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])
}
