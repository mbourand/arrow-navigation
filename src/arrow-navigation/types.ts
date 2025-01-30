import { RefObject } from 'react'
import { EnteringPolicy } from './group/entering-policy'

export type SelectableType = {
  ref: RefObject<HTMLElement>
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
}
