import { ReactNode, useId } from 'react'
import { SelectableGroupContext } from './GroupContext'
import { useSelectableGroup } from './useSelectableGroup'
import { EnteringPolicy } from './entering-policy'

type SelectableGroupProps = {
  children: ReactNode
  id?: string
  enteringPolicy?: EnteringPolicy
}

export const SelectableGroup = ({
  children,
  id,
  enteringPolicy = EnteringPolicy.FromDirection,
}: SelectableGroupProps) => {
  const reactId = useId()
  const usedId = id ?? reactId

  useSelectableGroup({ id: usedId, enteringPolicy })

  return <SelectableGroupContext.Provider value={{ groupId: usedId }}>{children}</SelectableGroupContext.Provider>
}
