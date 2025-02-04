import { RefObject } from 'react'
import { EnteringPolicy } from './group/entering-policy'
import { EventHandlers } from './EventManager'

export type SelectableType = {
  ref: RefObject<HTMLElement | null>
  id: string
  enteringPolicy?: EnteringPolicy
  groupId: string
}

export type SelectableGroupType = {
  ref?: RefObject<HTMLElement | null>
  id: string
  enteringPolicy: EnteringPolicy
  lastSelectedElementId?: string
  onElementFocused?: EventHandlers['onElementFocused']
  onGroupLeaved?: EventHandlers['onGroupLeaved']
}
