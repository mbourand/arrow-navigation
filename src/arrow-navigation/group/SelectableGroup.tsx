import { FC, PropsWithChildren, ReactNode, RefObject, useId } from 'react'
import { SelectableGroupContext } from './GroupContext'
import { useSelectableGroup } from './useSelectableGroup'
import { EnteringPolicy } from './entering-policy'
import { SelectableGroupType, SelectableType } from '../types'

export type SelectableGroupProps = {
  ref?: RefObject<HTMLElement | null>
  children: ReactNode
  id?: string
  enteringPolicy?: EnteringPolicy
  As?: string | FC<PropsWithChildren & { id: string; ref?: RefObject<HTMLElement | null> }>
  props?: object
  onElementFocused?: (selectable: SelectableType) => void
  onGroupLeaved?: (group: SelectableGroupType) => void
}

export const SelectableGroup = ({
  As,
  children,
  id,
  ref,
  onElementFocused,
  onGroupLeaved,
  enteringPolicy = EnteringPolicy.FromDirection,
  props = {},
}: SelectableGroupProps) => {
  const reactId = useId()
  const usedId = id ?? reactId

  useSelectableGroup({ ref, id: usedId, enteringPolicy, onElementFocused, onGroupLeaved })

  return (
    <SelectableGroupContext.Provider value={{ groupId: usedId }}>
      {As ? (
        <As id={usedId} ref={ref} {...props}>
          {children}
        </As>
      ) : (
        children
      )}
    </SelectableGroupContext.Provider>
  )
}
