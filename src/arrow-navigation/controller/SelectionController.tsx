import { ReactNode, useLayoutEffect, useRef } from 'react'
import { useArrowNavigationStore } from '../store'
import { useShallow } from 'zustand/shallow'
import { SelectableRegionType, SelectableType } from '../types'
import { isKeyOf } from '../../utils/isKeyOf'
import { filterUntruthy } from '../../utils/filterUntruthy'
import { SelectableRegionContext } from '../region/RegionContext'
import { getFirstElementToFocus } from '../region/entering-policy'
import { ComparisonDirection, DirectionDataType, findCandidates } from './find-candidates'
import { findBestCandidate } from './best-candidate'
import { autoScrollToElement } from './auto-scroll'

type SelectionControllerProps = {
  children: ReactNode
  initialFocusedId?: string
}

type KeyCode = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'

const KEY_CODE_TO_DIRECTIONS = {
  ArrowDown: {
    axis: 'y',
    comparisonDirection: ComparisonDirection.TOWARDS_POSITIVE,
    edge: 'bottom',
    edgeToCompareWith: 'top',
  },
  ArrowUp: {
    axis: 'y',
    comparisonDirection: ComparisonDirection.TOWARDS_NEGATIVE,
    edge: 'top',
    edgeToCompareWith: 'bottom',
  },
  ArrowLeft: {
    axis: 'x',
    comparisonDirection: ComparisonDirection.TOWARDS_NEGATIVE,
    edge: 'left',
    edgeToCompareWith: 'right',
  },
  ArrowRight: {
    axis: 'x',
    comparisonDirection: ComparisonDirection.TOWARDS_POSITIVE,
    edge: 'right',
    edgeToCompareWith: 'left',
  },
} as const satisfies Record<KeyCode, DirectionDataType>

export const SelectionController = ({ children, initialFocusedId }: SelectionControllerProps) => {
  const focusedIdRef = useRef(initialFocusedId)
  const selectablesRef = useRef(new Map<string, SelectableType>())
  const regionsRef = useRef(new Map<string, SelectableRegionType>())

  const { eventManager } = useArrowNavigationStore(useShallow((state) => state))

  const focusTo = (selectable: SelectableType) => {
    const selectableElement = selectable.ref.current
    if (!selectableElement) return

    const elementThatWasFocused = focusedIdRef.current ? selectablesRef.current.get(focusedIdRef.current) : null

    selectableElement.focus({ preventScroll: true })
    const selectableRegion = regionsRef.current.get(selectable.regionId)
    if (selectableRegion) selectableRegion.lastSelectedElementId = selectable.id
    focusedIdRef.current = selectable.id

    eventManager.emit('onElementFocused', selectable)
    if (elementThatWasFocused?.regionId && elementThatWasFocused.regionId !== selectable.regionId) {
      const unfocusedRegion = regionsRef.current.get(elementThatWasFocused.regionId)
      if (unfocusedRegion) eventManager.emit('onRegionLeaved', unfocusedRegion)
    }

    autoScrollToElement(selectableElement)
  }

  const tryFocusFromEnteringPolicy = (
    selectables: SelectableType[],
    region: SelectableRegionType,
    currentFocusElement: HTMLElement
  ) => {
    const elementToFocusFromPolicy = getFirstElementToFocus(
      region,
      filterUntruthy(selectables.filter((s) => s.regionId === region.id).map((s) => s.ref.current)),
      currentFocusElement
    )

    if (!elementToFocusFromPolicy) return false

    const selectable = selectables.find((s) => s.id === elementToFocusFromPolicy.id)
    if (!selectable) return false

    focusTo(selectable)
    return true
  }

  const tryFocus = (currentFocus: SelectableType, code: string, selectables: Map<string, SelectableType>) => {
    if (!isKeyOf(KEY_CODE_TO_DIRECTIONS, code)) {
      return false
    }

    const directionData = KEY_CODE_TO_DIRECTIONS[code]
    const currentFocusElement = currentFocus.ref.current
    const currentFocusPosition = currentFocusElement?.getBoundingClientRect()
    const currentFocusRegion = regionsRef.current.get(currentFocus.regionId)
    if (!currentFocusElement || !currentFocusPosition || !currentFocusRegion) return false

    const selectablesArray = Array.from(selectables.values())
    const regionsArray = Array.from(regionsRef.current.values())

    const candidates = findCandidates(selectablesArray, regionsArray, currentFocus, currentFocusRegion, directionData)
    const bestCandidateId = findBestCandidate(candidates.selectables, candidates.regions, currentFocus)
    if (!bestCandidateId) return false

    if (regionsRef.current.has(bestCandidateId)) {
      const bestCandidateRegion = regionsRef.current.get(bestCandidateId)
      return (
        bestCandidateRegion && tryFocusFromEnteringPolicy(selectablesArray, bestCandidateRegion, currentFocusElement)
      )
    }

    const bestCandidateSelectable = selectables.get(bestCandidateId)
    if (!bestCandidateSelectable) return false

    if (bestCandidateSelectable.regionId !== currentFocus.regionId) {
      const regionToFocus = regionsRef.current.get(bestCandidateSelectable.regionId)
      if (regionToFocus && tryFocusFromEnteringPolicy(selectablesArray, regionToFocus, currentFocusElement)) return true
    }

    focusTo(bestCandidateSelectable)
    return true
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (!isKeyOf(KEY_CODE_TO_DIRECTIONS, e.code)) return

    e.preventDefault()
    if (!focusedIdRef.current) {
      const firstElement = selectablesRef.current.values().next().value
      if (firstElement) focusTo(firstElement)
      return
    }

    const focusedId = focusedIdRef.current
    const selectables = selectablesRef.current

    const currentlyFocusedElement = selectables.get(focusedId)
    if (!currentlyFocusedElement) return

    if (tryFocus(currentlyFocusedElement, e.code, selectables)) return
  }

  const onElementRegistered = (selectable: SelectableType) => selectablesRef.current.set(selectable.id, selectable)
  const onElementUnregistered = (id: string) => selectablesRef.current.delete(id)
  const onRegionRegistered = (region: SelectableRegionType) => regionsRef.current.set(region.id, region)
  const onRegionUnregistered = (id: string) => regionsRef.current.delete(id)

  useLayoutEffect(() => {
    const abortController = new AbortController()

    eventManager.on('elementRegistered', onElementRegistered, abortController.signal)
    eventManager.on('elementUnregistered', onElementUnregistered, abortController.signal)
    eventManager.on('regionRegistered', onRegionRegistered, abortController.signal)
    eventManager.on('regionUnregistered', onRegionUnregistered, abortController.signal)
    window.addEventListener('keydown', onKeyDown, { signal: abortController.signal })

    return () => abortController.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SelectableRegionContext.Provider value={{ regionId: '__global_arrow_navigation_context__' }}>
      {children}
    </SelectableRegionContext.Provider>
  )
}
