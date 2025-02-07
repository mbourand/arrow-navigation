import { RefObject } from 'react'
import { EnteringPolicy } from './region/entering-policy'
import { EventHandlers } from './EventManager'

export type SelectableType<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T | null>
  id: string
  regionId: string
}

export type SelectableRegionType<T extends HTMLElement = HTMLElement> = {
  ref?: RefObject<T | null>
  id: string
  enteringPolicy: EnteringPolicy
  lastSelectedElementId?: string
  onElementFocused?: EventHandlers['onElementFocused']
  onRegionLeaved?: EventHandlers['onRegionLeaved']
}
