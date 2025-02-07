import { SelectableRegionType, SelectableType } from '../types'

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
  currentRegion: SelectableRegionType,
  candidate: SelectableRegionType | SelectableType,
  selectionDirectionData: DirectionDataType
) => {
  if (!candidate.ref?.current) return false
  if (candidate.id === currentFocus.id) return false

  const currentFocusPosition = currentFocus.ref.current?.getBoundingClientRect()
  if (!currentFocusPosition) return false

  const rect = candidate.ref.current.getBoundingClientRect()

  const currentRegionPos = currentRegion.ref?.current?.getBoundingClientRect()

  const regionId = 'regionId' in candidate ? candidate.regionId : candidate.id
  const basePositionToUse =
    regionId === currentFocus.regionId ? currentFocusPosition : currentRegionPos ?? currentFocusPosition

  const xCoordinateOverlap = basePositionToUse.right >= rect.left && basePositionToUse.left <= rect.right
  const yCoordinateOverlap = basePositionToUse.bottom >= rect.top && basePositionToUse.top <= rect.bottom

  if (selectionDirectionData.axis === 'x' && !yCoordinateOverlap) return false
  else if (selectionDirectionData.axis === 'y' && !xCoordinateOverlap) return false

  return (
    rect[selectionDirectionData.edgeToCompareWith] * selectionDirectionData.comparisonDirection >
    basePositionToUse[selectionDirectionData.edge] * selectionDirectionData.comparisonDirection
  )
}

export const findCandidates = (
  selectables: SelectableType[],
  regions: SelectableRegionType[],
  currentFocus: SelectableType,
  currentRegion: SelectableRegionType,
  selectionDirectionData: DirectionDataType
) => ({
  selectables: selectables.filter((e) => isValidCandidate(currentFocus, currentRegion, e, selectionDirectionData)),
  regions: regions.filter((e) => isValidCandidate(currentFocus, currentRegion, e, selectionDirectionData)),
})
