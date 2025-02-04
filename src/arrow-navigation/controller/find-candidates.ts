import { SelectableType } from '../types'

export const ComparisonDirection = {
  TOWARDS_NEGATIVE: -1,
  TOWARDS_POSITIVE: 1,
} as const

type RectSide = Extract<keyof DOMRect, 'top' | 'left' | 'right' | 'bottom'>

export type DirectionDataType = {
  axis: 'x' | 'y'
  comparisonDirection: (typeof ComparisonDirection)[keyof typeof ComparisonDirection]
  edge: RectSide
  edgeToCompareWith: RectSide
}

export const findCandidates = (
  selectables: SelectableType[],
  currentFocus: SelectableType,
  selectionDirectionData: DirectionDataType
) => {
  const currentFocusPosition = currentFocus.ref.current?.getBoundingClientRect()
  if (!currentFocusPosition) return []

  return selectables.filter((candidate) => {
    if (!candidate.ref.current) return false
    if (candidate.id === currentFocus.id) return false

    const rect = candidate.ref.current.getBoundingClientRect()

    const xCoordinateOverlap = currentFocusPosition.right >= rect.left && currentFocusPosition.left <= rect.right
    const yCoordinateOverlap = currentFocusPosition.bottom >= rect.top && currentFocusPosition.top <= rect.bottom

    // Possible improvement here by also checking for overlap with candidate's group if it is not the same as the current group
    // This should allow to focus on a group that overlap even if the selectable we are checking is not overlapping
    if (selectionDirectionData.axis === 'x' && !yCoordinateOverlap) return false
    else if (selectionDirectionData.axis === 'y' && !xCoordinateOverlap) return false

    return (
      rect[selectionDirectionData.edgeToCompareWith] * selectionDirectionData.comparisonDirection >
      currentFocusPosition[selectionDirectionData.edge] * selectionDirectionData.comparisonDirection
    )
  })
}
