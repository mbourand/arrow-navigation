import { useContext, useEffect, useId, useMemo, useRef } from 'react'
import { useArrowNavigationStore } from '../store'
import { SelectableType } from '../types'
import { MakeOptional } from '../../utils/types'
import { SelectableRegionContext } from '../region/RegionContext'

export const useSelectable = <T extends HTMLElement>(
  params: MakeOptional<SelectableType<T>, 'id' | 'ref' | 'regionId'>
) => {
  const { registerSelectable, unregisterSelectable } = useArrowNavigationStore((state) => state)

  const reactId = useId()
  const regionContext = useContext(SelectableRegionContext) ?? { regionId: '' }
  if (!regionContext) throw new Error('Selectable component must be a child of SelectableRegion')

  const usedId = params.id ?? reactId

  const baseRef = useRef<T>(null)
  const usedRef = params.ref ?? baseRef
  const usedRegionId = params.regionId ?? regionContext.regionId

  const selectable: SelectableType<T> = useMemo(
    () => ({ ...params, id: usedId, ref: usedRef, regionId: usedRegionId }),
    [params, usedRegionId, usedId, usedRef]
  )

  useEffect(() => {
    registerSelectable(selectable)
    return () => unregisterSelectable(selectable.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  return { selectable, props: { ref: usedRef, id: usedId } }
}
