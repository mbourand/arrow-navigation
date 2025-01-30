import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { useArrowNavigationStore } from '../store'
import { useShallow } from 'zustand/shallow'
import { SelectableGroupType, SelectableType } from '../types'
import { isKeyOf } from '../../utils/isKeyOf'
import { filterUntruthy } from '../../utils/filterUntruthy'
import { SelectableGroupContext } from '../group/GroupContext'
import { getFirstElementToFocus } from '../group/entering-policy'

type SelectionControllerProps = {
  children: ReactNode
  initialFocusedId?: string
}

type KeyCode = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'

type DirectionDataType = {
  axis: 'x' | 'y'
  comparisonDirection: 1 | -1
  edge: keyof DOMRect
  edgeToCompareWith: keyof DOMRect
}

const KEY_CODE_TO_DIRECTIONS = {
  ArrowDown: { axis: 'y', comparisonDirection: 1, edge: 'bottom', edgeToCompareWith: 'top' },
  ArrowUp: { axis: 'y', comparisonDirection: -1, edge: 'top', edgeToCompareWith: 'bottom' },
  ArrowLeft: { axis: 'x', comparisonDirection: -1, edge: 'left', edgeToCompareWith: 'right' },
  ArrowRight: { axis: 'x', comparisonDirection: 1, edge: 'right', edgeToCompareWith: 'left' },
} as const satisfies Record<KeyCode, DirectionDataType>

export const SelectionController = ({ children, initialFocusedId }: SelectionControllerProps) => {
  const focusedIdRef = useRef(initialFocusedId)
  const selectablesRef = useRef(new Map<string, SelectableType>())
  const groupsRef = useRef(new Map<string, SelectableGroupType>())
  const isInitialRender = useRef(true)

  const { eventManager } = useArrowNavigationStore(useShallow((state) => state))

  const tryFocusWithCurrentGroup = (
    currentFocus: SelectableType,
    code: string,
    selectables: Map<string, SelectableType>
  ) => {
    if (isKeyOf(KEY_CODE_TO_DIRECTIONS, code)) {
      const directionData = KEY_CODE_TO_DIRECTIONS[code]
      const currentFocusPosition = currentFocus.ref.current?.getBoundingClientRect()
      if (!currentFocusPosition) return false

      const candidates = Array.from(selectables.values()).filter((s) => {
        if (!s.ref.current) return false
        if (s.id === currentFocus.id) return false

        switch (directionData.comparisonDirection) {
          case -1:
            return (
              s.ref.current.getBoundingClientRect()[directionData.edgeToCompareWith] <
              currentFocusPosition[directionData.edge]
            )
          case 1:
            return (
              s.ref.current.getBoundingClientRect()[directionData.edgeToCompareWith] >
              currentFocusPosition[directionData.edge]
            )
        }
      })

      const bestCandidate = candidates.reduce((best, candidate) => {
        if (!candidate.ref.current) return best

        const candidateRect = candidate.ref.current.getBoundingClientRect()

        const currentEdge = currentFocusPosition[directionData.edge]
        const candidateEdgeToCompareWith = candidateRect[directionData.edgeToCompareWith]
        const distanceOnMainAxis = currentEdge - candidateEdgeToCompareWith
        const currentCenter = {
          x: currentFocusPosition.left + currentFocusPosition.width / 2,
          y: currentFocusPosition.top + currentFocusPosition.height / 2,
        }
        const candidateCenter = {
          x: candidateRect.left + candidateRect.width / 2,
          y: candidateRect.top + candidateRect.height / 2,
        }

        const distanceOnSecondAxis =
          directionData.axis === 'x' ? currentCenter.y - candidateCenter.y : currentCenter.x - candidateCenter.x

        const distanceSq = distanceOnMainAxis ** 2 + distanceOnSecondAxis ** 2

        if (!best) return { item: candidate, distance: distanceSq }
        return distanceSq < best.distance ? { item: candidate, distance: distanceSq } : best
      }, null as { item: SelectableType; distance: number } | null)

      if (bestCandidate) {
        if (bestCandidate.item.groupId !== currentFocus.groupId && currentFocus.ref.current) {
          const groupToFocus = groupsRef.current.get(bestCandidate.item.groupId)
          const selectablesFromGroup = Array.from(selectables.values()).filter(
            (s) => s.groupId === bestCandidate.item.groupId
          )
          if (groupToFocus) {
            const elementToFocusFromPolicy = getFirstElementToFocus(
              groupToFocus.enteringPolicy,
              filterUntruthy(selectablesFromGroup.map((s) => s.ref.current)),
              currentFocus.ref.current
            )
            if (elementToFocusFromPolicy) {
              elementToFocusFromPolicy.focus()
              focusedIdRef.current = selectablesRef.current.get(elementToFocusFromPolicy.id)?.id
              return true
            }
          }
        }

        bestCandidate.item.ref.current?.focus()
        focusedIdRef.current = bestCandidate.item.id
        return true
      }
    }

    return false
  }

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!focusedIdRef.current) {
      selectablesRef.current.values().next().value?.ref.current?.focus()
      focusedIdRef.current = selectablesRef.current.values().next().value?.id
      return
    }

    const focusedId = focusedIdRef.current
    const selectables = selectablesRef.current

    const currentlyFocusedElement = selectables.get(focusedId)
    if (!currentlyFocusedElement) return

    if (tryFocusWithCurrentGroup(currentlyFocusedElement, e.code, selectables)) return

    // Interroge le next du controller
  }, [])

  const onElementRegistered = useCallback((selectable: SelectableType) => {
    selectablesRef.current.set(selectable.id, selectable)
  }, [])

  const onElementUnregistered = useCallback((id: string) => {
    selectablesRef.current.delete(id)
  }, [])

  const onGroupRegistered = useCallback((group: SelectableGroupType) => {
    groupsRef.current.set(group.id, group)
  }, [])

  const onGroupUnregistered = useCallback((id: string) => {
    groupsRef.current.delete(id)
  }, [])

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      if (!focusedIdRef.current) return
      selectablesRef.current.get(focusedIdRef.current)?.ref.current?.focus()
    }
  }, [])

  useLayoutEffect(() => {
    const abortController = new AbortController()

    eventManager.on('elementRegistered', onElementRegistered)
    eventManager.on('elementUnregistered', onElementUnregistered)
    eventManager.on('groupRegistered', onGroupRegistered)
    eventManager.on('groupUnregistered', onGroupUnregistered)
    window.addEventListener('keydown', onKeyDown, { signal: abortController.signal })

    return () => {
      eventManager.off('elementRegistered', onElementRegistered)
      eventManager.off('elementUnregistered', onElementUnregistered)
      eventManager.off('groupRegistered', onGroupRegistered)
      eventManager.off('groupUnregistered', onGroupUnregistered)
      abortController.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SelectableGroupContext.Provider value={{ groupId: '__global_arrow_navigation_context__' }}>
      {children}
    </SelectableGroupContext.Provider>
  )
}
