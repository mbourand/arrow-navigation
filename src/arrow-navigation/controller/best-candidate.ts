import { SelectableRegionType, SelectableType } from '../types'

// Finds the point on rect1 that is the closest to rect2
const closestPointOnRect = (rect1: DOMRect, rect2: DOMRect) => {
  let x: number, y: number

  if (rect1.left >= rect2.right) x = rect1.left
  else if (rect1.right <= rect2.left) x = rect1.right
  else {
    const min = Math.max(rect1.left, rect2.left)
    const max = Math.min(rect1.right, rect2.right)
    x = min + (max - min) / 2
  }

  if (rect1.top >= rect2.bottom) y = rect1.top
  else if (rect1.bottom <= rect2.top) y = rect1.bottom
  else {
    const min = Math.max(rect1.top, rect2.top)
    const max = Math.min(rect1.bottom, rect2.bottom)
    y = min + (max - min) / 2
  }

  return { x, y }
}

const getShortestDistanceSquared = (currentRect: DOMRect, candidateRect: DOMRect) => {
  const p1 = closestPointOnRect(currentRect, candidateRect)
  const p2 = closestPointOnRect(candidateRect, currentRect)
  return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2
}

const areElementKeyPointsVisible = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()

  const pointsToCheckVisibility = [
    { x: rect.left, y: rect.top },
    { x: rect.right, y: rect.top },
    { x: rect.left, y: rect.bottom },
    { x: rect.right, y: rect.bottom },
    { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
    { x: rect.left + rect.width / 2, y: rect.top },
    { x: rect.left + rect.width / 2, y: rect.bottom },
    { x: rect.left, y: rect.top + rect.height / 2 },
    { x: rect.right, y: rect.top + rect.height / 2 },
  ]

  return pointsToCheckVisibility.some((point) => element.ownerDocument.elementFromPoint(point.x, point.y) === element)
}

const nearestVisibleCandidate = <T extends SelectableType | SelectableRegionType>(
  candidates: T[],
  currentFocusPosition: DOMRect
) =>
  candidates.reduce((best, candidate) => {
    const candidateElement = candidate.ref?.current
    if (!candidateElement) return best

    const rect = candidateElement.getBoundingClientRect()

    const distanceSq = getShortestDistanceSquared(currentFocusPosition, rect)

    if (!best) return { item: candidate, distance: distanceSq }
    if (distanceSq >= best.distance) return best

    const isVisible = areElementKeyPointsVisible(candidateElement)
    return isVisible ? { item: candidate, distance: distanceSq } : best
  }, null as { item: T; distance: number } | null)

export const findBestCandidate = (
  selectableCandidates: SelectableType[],
  regionCandidates: SelectableRegionType[],
  currentFocus: SelectableType
) => {
  const currentFocusPosition = currentFocus.ref.current?.getBoundingClientRect()
  if (!currentFocusPosition) return null

  const bestSelectable = nearestVisibleCandidate(selectableCandidates, currentFocusPosition)
  const bestRegion = nearestVisibleCandidate(regionCandidates, currentFocusPosition)

  if (!bestRegion) return bestSelectable?.item.id
  if (!bestSelectable) return bestRegion?.item.id

  return bestSelectable.distance <= bestRegion.distance ? bestSelectable.item.id : bestRegion.item.id
}
