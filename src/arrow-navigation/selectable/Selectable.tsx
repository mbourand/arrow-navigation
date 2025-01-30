import { FC, PropsWithChildren, ReactNode, RefObject, useContext, useId, useRef } from 'react'
import { SelectableType } from '../types'
import { SelectableGroupContext } from '../group/GroupContext'
import { useSelectable } from './useSelectable'

export type SelectableProps = {
  As: string | FC<PropsWithChildren & { ref: RefObject<HTMLElement>; id: string }>
  props?: object
  children: ReactNode
  id?: string
} & Omit<SelectableType, 'ref' | 'groupId' | 'id'>

export const Selectable = ({
  As,
  children,
  id,
  nextDown,
  nextLeft,
  nextRight,
  nextUp,
  props = {},
}: SelectableProps) => {
  const reactId = useId()
  const groupContext = useContext(SelectableGroupContext) ?? { groupId: '' }
  if (!groupContext) throw new Error('Selectable component must be a child of SelectableGroup')

  const usedId = id ?? reactId

  const ref = useRef(null)

  useSelectable({ ref, groupId: groupContext.groupId, id: usedId, nextDown, nextUp, nextRight, nextLeft })

  return (
    <As id={usedId} ref={ref} {...props}>
      {children}
    </As>
  )
}
