import { RefObject } from 'react'
import { EnteringPolicy } from './group/entering-policy'
import { EventHandlers } from './EventManager'

export type SelectableType = {
  ref: RefObject<HTMLElement | null>
  id: string
  enteringPolicy?: EnteringPolicy
  groupId: string
  nextDown?: string
  nextLeft?: string
  nextRight?: string
  nextUp?: string
}

export type SelectableGroupType = {
  id: string
  enteringPolicy: EnteringPolicy
  onElementFocused?: NonNullable<EventHandlers['onElementFocused']>[number]
  onGroupLeaved?: NonNullable<EventHandlers['onGroupLeaved']>[number]
}
