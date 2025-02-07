import { useCallback, useEffect, useId, useMemo, useRef } from 'react'
import { SelectableRegionType, SelectableType } from '../types'
import { useArrowNavigationStore } from '../store'
import { useShallow } from 'zustand/shallow'
import { EnteringPolicy } from './entering-policy'
import { MakeOptional } from '../../utils/types'

export const useSelectableRegion = <T extends HTMLElement>(
  props: MakeOptional<SelectableRegionType<T>, 'enteringPolicy' | 'id' | 'ref'>
) => {
  const reactId = useId()
  const usedId = props.id ?? reactId

  const baseRef = useRef<T>(null)
  const usedRef = props.ref ?? baseRef

  const region: SelectableRegionType<T> = useMemo(
    () => ({
      enteringPolicy: props.enteringPolicy ?? EnteringPolicy.FromDirection,
      id: usedId,
      onElementFocused: props.onElementFocused,
      onRegionLeaved: props.onRegionLeaved,
      ref: usedRef,
      lastSelectedElementId: undefined,
    }),
    [props.enteringPolicy, props.onElementFocused, props.onRegionLeaved, usedId, usedRef]
  )

  const { registerSelectableRegion, unregisterSelectableRegion, eventManager } = useArrowNavigationStore(
    useShallow((state) => state)
  )

  const onAnyElementFocused = useCallback(
    (selectable: SelectableType) => {
      if (selectable.regionId === region.id) region.onElementFocused?.(selectable)
    },
    [region]
  )

  const onAnyRegionLeaved = useCallback(
    (leftRegion: SelectableRegionType) => {
      if (leftRegion.id === region.id) region.onRegionLeaved?.(leftRegion)
    },
    [region]
  )

  useEffect(() => {
    const abortController = new AbortController()
    eventManager.on('onElementFocused', onAnyElementFocused, abortController.signal)
    eventManager.on('onRegionLeaved', onAnyRegionLeaved, abortController.signal)
    registerSelectableRegion(region)

    return () => {
      abortController.abort()
      unregisterSelectableRegion(region.id)
    }
  }, [
    eventManager,
    region,
    onAnyElementFocused,
    onAnyRegionLeaved,
    usedId,
    registerSelectableRegion,
    unregisterSelectableRegion,
  ])

  return {
    region,
    props: {
      id: region.id,
      ref: region.ref,
    },
  }
}
