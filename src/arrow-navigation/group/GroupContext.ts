import { createContext } from 'react'

type SelectableGroupContextType = {
  groupId: string
}

export const SelectableGroupContext = createContext<SelectableGroupContextType | null>(null)
