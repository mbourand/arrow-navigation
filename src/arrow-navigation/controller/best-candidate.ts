import { SelectableType } from '../types'
import { DirectionDataType } from './find-candidates'

// Computes the distance to the edge opposite to the direction
// ex. if the direction is right, the returned value is the squared distance
// between {x: currentFocus.right, y: currentFocus.centerY} and {x: candidate.left, y: candidate.centerY}
const getSquaredDistanceForSelection = (
  currentPosition: DOMRect,
  candidateRect: DOMRect,
  selectionDirectionData: DirectionDataType
) => {
  const currentEdge = currentPosition[selectionDirectionData.edge]
  const candidateEdgeToCompareWith = candidateRect[selectionDirectionData.edgeToCompareWith]

  const currentCenter = {
    x: currentPosition.left + currentPosition.width / 2,
    y: currentPosition.top + currentPosition.height / 2,
  }
  const candidateCenter = {
    x: candidateRect.left + candidateRect.width / 2,
    y: candidateRect.top + candidateRect.height / 2,
  }

  const distanceOnMainAxis = currentEdge - candidateEdgeToCompareWith
  const distanceOnSecondAxis =
    selectionDirectionData.axis === 'x' ? currentCenter.y - candidateCenter.y : currentCenter.x - candidateCenter.x

  return distanceOnMainAxis ** 2 + distanceOnSecondAxis ** 2
}

const areElementKeyPointsVisible = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()

  const pointsToCheckVisibility = [
    // Corners
    { x: rect.left, y: rect.top },
    { x: rect.right, y: rect.top },
    { x: rect.left, y: rect.bottom },
    { x: rect.right, y: rect.bottom },

    // Center
    { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },

    // Edges
    { x: rect.left + rect.width / 2, y: rect.top },
    { x: rect.left + rect.width / 2, y: rect.bottom },
    { x: rect.left, y: rect.top + rect.height / 2 },
    { x: rect.right, y: rect.top + rect.height / 2 },
  ]

  return pointsToCheckVisibility.some((point) => element.ownerDocument.elementFromPoint(point.x, point.y) === element)
}

// Best candidate is a candidate the visible candidate
// whose distance from the edge opposite to the direction is the closest to the current focus' edge of the direction
// ex. if the direction is right, the best candidate is the one that has the closest left edge to the current focus' right edge
export const findBestCandidate = (
  candidates: SelectableType[],
  currentFocus: SelectableType,
  selectionDirectionData: DirectionDataType
) => {
  const currentFocusPosition = currentFocus.ref.current?.getBoundingClientRect()
  if (!currentFocusPosition) return null

  return candidates.reduce((best, candidate) => {
    const candidateElement = candidate.ref.current
    if (!candidateElement) return best

    const rect = candidateElement.getBoundingClientRect()

    const distanceSq = getSquaredDistanceForSelection(currentFocusPosition, rect, selectionDirectionData)

    if (!best) return { item: candidate, distance: distanceSq }
    if (distanceSq >= best.distance) return best

    const isVisible = areElementKeyPointsVisible(candidateElement)
    return isVisible ? { item: candidate, distance: distanceSq } : best
  }, null as { item: SelectableType; distance: number } | null)
}
