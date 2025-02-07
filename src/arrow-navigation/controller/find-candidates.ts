import { SelectableGroupType, SelectableType } from '../types'

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

const isValidCandidate = (
  currentFocus: SelectableType,
  currentGroup: SelectableGroupType,
  candidate: SelectableGroupType | SelectableType,
  selectionDirectionData: DirectionDataType
) => {
  if (!candidate.ref?.current) return false
  if (candidate.id === currentFocus.id) return false

  const currentFocusPosition = currentFocus.ref.current?.getBoundingClientRect()
  if (!currentFocusPosition) return false

  const rect = candidate.ref.current.getBoundingClientRect()

  const currentGroupPos = currentGroup.ref?.current?.getBoundingClientRect()

  const groupId = 'groupId' in candidate ? candidate.groupId : candidate.id
  const basePositionToUse =
    groupId === currentFocus.groupId ? currentFocusPosition : currentGroupPos ?? currentFocusPosition

  const xCoordinateOverlap = basePositionToUse.right >= rect.left && basePositionToUse.left <= rect.right
  const yCoordinateOverlap = basePositionToUse.bottom >= rect.top && basePositionToUse.top <= rect.bottom

  // Possible improvement here by also checking for overlap with candidate's group if it is not the same as the current group
  // This should allow to focus on a group that overlap even if the selectable we are checking is not overlapping
  if (selectionDirectionData.axis === 'x' && !yCoordinateOverlap) return false
  else if (selectionDirectionData.axis === 'y' && !xCoordinateOverlap) return false

  return (
    rect[selectionDirectionData.edgeToCompareWith] * selectionDirectionData.comparisonDirection >
    basePositionToUse[selectionDirectionData.edge] * selectionDirectionData.comparisonDirection
  )
}

export const findCandidates = (
  selectables: SelectableType[],
  groups: SelectableGroupType[],
  currentFocus: SelectableType,
  currentGroup: SelectableGroupType,
  selectionDirectionData: DirectionDataType
) => ({
  selectables: selectables.filter((e) => isValidCandidate(currentFocus, currentGroup, e, selectionDirectionData)),
  groups: groups.filter((e) => isValidCandidate(currentFocus, currentGroup, e, selectionDirectionData)),
})
