import { HTMLAttributes } from 'react'
import { SelectableRegion } from './SelectableRegion'
import { useSelectableRegion as useSelectableRegion } from './useSelectableRegion'
import { SelectableRegionType } from '../types'
import { MakeOptional } from '../../utils/types'

type Props<T extends HTMLElement> = MakeOptional<SelectableRegionType<T>, 'enteringPolicy' | 'id' | 'ref'> &
  HTMLAttributes<T>

const RegionDiv = (props: Props<HTMLDivElement>) => {
  const { region, props: propsToOverride } = useSelectableRegion(props)

  return (
    <SelectableRegion id={region.id}>
      <div {...props} {...propsToOverride}>
        {props.children}
      </div>
    </SelectableRegion>
  )
}

const RegionNav = (props: Props<HTMLElement>) => {
  const { region, props: propsToOverride } = useSelectableRegion(props)

  return (
    <SelectableRegion id={region.id}>
      <nav {...props} {...propsToOverride}>
        {props.children}
      </nav>
    </SelectableRegion>
  )
}

export const region = {
  div: RegionDiv,
  nav: RegionNav,
}
