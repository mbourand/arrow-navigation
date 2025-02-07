import { ReactNode } from 'react'
import { SelectableRegionContext } from './RegionContext'

type SelectableRegionProps = {
  children?: ReactNode
  id: string
}

export const SelectableRegion = ({ children, id }: SelectableRegionProps) => (
  <SelectableRegionContext.Provider value={{ regionId: id }}>{children}</SelectableRegionContext.Provider>
)
