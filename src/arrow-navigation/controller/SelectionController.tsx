import { ReactNode, useEffect, useLayoutEffect, useRef } from 'react'
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

  const focusElement = (selectable: SelectableType) => {
    const elementThatWasFocused = focusedIdRef.current ? selectablesRef.current.get(focusedIdRef.current) : null

    selectable.ref.current?.focus({ preventScroll: true })
    const selectableGroup = groupsRef.current.get(selectable.groupId)
    if (selectableGroup) selectableGroup.lastSelectedElementId = selectable.id
    focusedIdRef.current = selectable.id

    eventManager.emit('onElementFocused', selectable)

    if (elementThatWasFocused?.groupId && elementThatWasFocused.groupId !== selectable.groupId) {
      const unfocusedGroup = groupsRef.current.get(elementThatWasFocused.groupId)
      if (unfocusedGroup) eventManager.emit('onGroupLeaved', unfocusedGroup)
    }

    const selectablePos = selectable.ref.current?.getBoundingClientRect()
    if (selectablePos) {
      if (selectablePos.bottom > window.innerHeight * 0.75 || selectablePos.top < window.innerHeight * 0.25) {
        window.scrollTo({
          top: selectablePos.top + selectablePos.height / 2 + window.scrollY - window.innerHeight / 2,
          behavior: 'smooth',
        })
      }
    }
  }

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

        const sRect = s.ref.current.getBoundingClientRect()

        if (directionData.axis === 'x') {
          if (currentFocusPosition.bottom < sRect.top || currentFocusPosition.top > sRect.bottom) return false
        } else if (directionData.axis === 'y') {
          if (currentFocusPosition.right < sRect.left || currentFocusPosition.left > sRect.right) return false
        }

        switch (directionData.comparisonDirection) {
          case -1:
            return sRect[directionData.edgeToCompareWith] < currentFocusPosition[directionData.edge]
          case 1:
            return sRect[directionData.edgeToCompareWith] > currentFocusPosition[directionData.edge]
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

        if (distanceSq >= best.distance) return best

        const pointsToCheckVisibility = [
          { x: candidateRect.left, y: candidateRect.top },
          { x: candidateRect.right, y: candidateRect.top },
          { x: candidateRect.left, y: candidateRect.bottom },
          { x: candidateRect.right, y: candidateRect.bottom },
          { x: candidateRect.left + candidateRect.width / 2, y: candidateRect.top + candidateRect.height / 2 },
          { x: candidateRect.left + candidateRect.width / 2, y: candidateRect.top },
          { x: candidateRect.left + candidateRect.width / 2, y: candidateRect.bottom },
          { x: candidateRect.left, y: candidateRect.top + candidateRect.height / 2 },
          { x: candidateRect.right, y: candidateRect.top + candidateRect.height / 2 },
        ]

        const isVisible = pointsToCheckVisibility.some(
          (point) => document.elementFromPoint(point.x, point.y) === candidate.ref.current
        )
        return isVisible ? { item: candidate, distance: distanceSq } : best
      }, null as { item: SelectableType; distance: number } | null)

      if (bestCandidate) {
        if (bestCandidate.item.groupId !== currentFocus.groupId && currentFocus.ref.current) {
          const groupToFocus = groupsRef.current.get(bestCandidate.item.groupId)
          const selectablesFromGroup = Array.from(selectables.values()).filter(
            (s) => s.groupId === bestCandidate.item.groupId
          )
          if (groupToFocus) {
            const elementToFocusFromPolicy = getFirstElementToFocus(
              groupToFocus,
              filterUntruthy(selectablesFromGroup.map((s) => s.ref.current)),
              currentFocus.ref.current
            )

            if (elementToFocusFromPolicy) {
              const selectableToFocus = selectables.get(elementToFocusFromPolicy.id)
              if (selectableToFocus) {
                focusElement(selectableToFocus)
                return true
              }
            }
          }
        }

        focusElement(bestCandidate.item)
        return true
      }
    }

    return false
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (!isKeyOf(KEY_CODE_TO_DIRECTIONS, e.code)) {
      return
    }

    e.preventDefault()
    if (!focusedIdRef.current) {
      const firstElement = selectablesRef.current.values().next().value
      if (firstElement) focusElement(firstElement)
      return
    }

    const focusedId = focusedIdRef.current
    const selectables = selectablesRef.current

    const currentlyFocusedElement = selectables.get(focusedId)
    if (!currentlyFocusedElement) return

    if (tryFocusWithCurrentGroup(currentlyFocusedElement, e.code, selectables)) return
  }

  const onElementRegistered = (selectable: SelectableType) => selectablesRef.current.set(selectable.id, selectable)
  const onElementUnregistered = (id: string) => selectablesRef.current.delete(id)
  const onGroupRegistered = (group: SelectableGroupType) => groupsRef.current.set(group.id, group)
  const onGroupUnregistered = (id: string) => groupsRef.current.delete(id)

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
