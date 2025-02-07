import { ReactNode, useLayoutEffect, useRef } from 'react'
import { useArrowNavigationStore } from '../store'
import { useShallow } from 'zustand/shallow'
import { SelectableGroupType, SelectableType } from '../types'
import { isKeyOf } from '../../utils/isKeyOf'
import { filterUntruthy } from '../../utils/filterUntruthy'
import { SelectableGroupContext } from '../group/GroupContext'
import { getFirstElementToFocus } from '../group/entering-policy'
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
  const groupsRef = useRef(new Map<string, SelectableGroupType>())

  const { eventManager } = useArrowNavigationStore(useShallow((state) => state))

  const focusTo = (selectable: SelectableType) => {
    const selectableElement = selectable.ref.current
    if (!selectableElement) return

    const elementThatWasFocused = focusedIdRef.current ? selectablesRef.current.get(focusedIdRef.current) : null

    selectableElement.focus({ preventScroll: true })
    const selectableGroup = groupsRef.current.get(selectable.groupId)
    if (selectableGroup) selectableGroup.lastSelectedElementId = selectable.id
    focusedIdRef.current = selectable.id

    eventManager.emit('onElementFocused', selectable)
    if (elementThatWasFocused?.groupId && elementThatWasFocused.groupId !== selectable.groupId) {
      const unfocusedGroup = groupsRef.current.get(elementThatWasFocused.groupId)
      if (unfocusedGroup) eventManager.emit('onGroupLeaved', unfocusedGroup)
    }

    autoScrollToElement(selectableElement)
  }

  const tryFocusFromEnteringPolicy = (
    selectables: SelectableType[],
    group: SelectableGroupType,
    currentFocusElement: HTMLElement
  ) => {
    const elementToFocusFromPolicy = getFirstElementToFocus(
      group,
      filterUntruthy(selectables.filter((s) => s.groupId === group.id).map((s) => s.ref.current)),
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
    const currentFocusGroup = groupsRef.current.get(currentFocus.groupId)
    if (!currentFocusElement || !currentFocusPosition || !currentFocusGroup) return false

    const selectablesArray = Array.from(selectables.values())
    const groupsArray = Array.from(groupsRef.current.values())

    const candidates = findCandidates(selectablesArray, groupsArray, currentFocus, currentFocusGroup, directionData)
    const bestCandidateId = findBestCandidate(candidates.selectables, candidates.groups, currentFocus)
    if (!bestCandidateId) return false

    if (groupsRef.current.has(bestCandidateId)) {
      const bestCandidateGroup = groupsRef.current.get(bestCandidateId)
      return bestCandidateGroup && tryFocusFromEnteringPolicy(selectablesArray, bestCandidateGroup, currentFocusElement)
    }

    const bestCandidateSelectable = selectables.get(bestCandidateId)
    if (!bestCandidateSelectable) return false

    if (bestCandidateSelectable.groupId !== currentFocus.groupId) {
      const groupToFocus = groupsRef.current.get(bestCandidateSelectable.groupId)
      if (groupToFocus && tryFocusFromEnteringPolicy(selectablesArray, groupToFocus, currentFocusElement)) return true
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
  const onGroupRegistered = (group: SelectableGroupType) => groupsRef.current.set(group.id, group)
  const onGroupUnregistered = (id: string) => groupsRef.current.delete(id)

  useLayoutEffect(() => {
    const abortController = new AbortController()

    eventManager.on('elementRegistered', onElementRegistered, abortController.signal)
    eventManager.on('elementUnregistered', onElementUnregistered, abortController.signal)
    eventManager.on('groupRegistered', onGroupRegistered, abortController.signal)
    eventManager.on('groupUnregistered', onGroupUnregistered, abortController.signal)
    window.addEventListener('keydown', onKeyDown, { signal: abortController.signal })

    return () => abortController.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SelectableGroupContext.Provider value={{ groupId: '__global_arrow_navigation_context__' }}>
      {children}
    </SelectableGroupContext.Provider>
  )
}
