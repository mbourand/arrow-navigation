import { SelectableGroupType } from '../types'

export enum EnteringPolicy {
  FromDirection = 'FromDirection',
  Top = 'Top',
  Bottom = 'Bottom',
  Left = 'Left',
  Right = 'Right',
  TopLeft = 'TopLeft',
  TopRight = 'TopRight',
  BottomLeft = 'BottomLeft',
  BottomRight = 'BottomRight',
  Last = 'Last',
}

const getNearestElement = (elements: HTMLElement[], position: { x: number; y: number }) => {
  let minDistance = Infinity
  let nearestElement: HTMLElement | null = null

  for (const element of elements) {
    const rect = element.getBoundingClientRect()
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    const distance = Math.sqrt((position.x - center.x) ** 2 + (position.y - center.y) ** 2)

    if (distance < minDistance) {
      minDistance = distance
      nearestElement = element
    }
  }

  return nearestElement
}

export const getFirstElementToFocus = (
  group: SelectableGroupType,
  elements: HTMLElement[],
  currentElement: HTMLElement
): HTMLElement | null => {
  const currentRect = currentElement.getBoundingClientRect()
  const currentCenter = { x: currentRect.left + currentRect.width / 2, y: currentRect.top + currentRect.height / 2 }
  const withoutSelf = elements.filter((element) => element.id !== currentElement.id)

  switch (group.enteringPolicy) {
    case EnteringPolicy.FromDirection:
      return getNearestElement(withoutSelf, currentCenter)
    case EnteringPolicy.Top:
      return getNearestElement(withoutSelf, { x: currentCenter.x, y: -999999 })
    case EnteringPolicy.Bottom:
      return getNearestElement(withoutSelf, { x: currentCenter.x, y: 999999 })
    case EnteringPolicy.Left:
      return getNearestElement(withoutSelf, { x: -999999, y: currentCenter.y })
    case EnteringPolicy.Right:
      return getNearestElement(withoutSelf, { x: 999999, y: currentCenter.y })
    case EnteringPolicy.TopLeft:
      return getNearestElement(withoutSelf, { x: 999999, y: -999999 })
    case EnteringPolicy.TopRight:
      return getNearestElement(withoutSelf, { x: 999999, y: -999999 })
    case EnteringPolicy.BottomLeft:
      return getNearestElement(withoutSelf, { x: -999999, y: 999999 })
    case EnteringPolicy.BottomRight:
      return getNearestElement(withoutSelf, { x: 999999, y: 999999 })
    case EnteringPolicy.Last:
      return elements.find((element) => element.id === group.lastSelectedElementId) ?? elements[0]
  }
}
