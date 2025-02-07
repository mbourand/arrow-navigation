import { createContext } from 'react'

type SelectableRegionContextType = {
  regionId: string
}

export const SelectableRegionContext = createContext<SelectableRegionContextType | null>(null)
