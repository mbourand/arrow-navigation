import { HTMLAttributes } from 'react'
import { SelectableGroup, SelectableGroupProps } from '../group/SelectableGroup'

type Props<T extends HTMLElement> = Omit<SelectableGroupProps, 'As' | 'props'> & HTMLAttributes<T>

const GroupDiv = (props: Props<HTMLDivElement>) => (
  <SelectableGroup {...props} props={props} As="div">
    {props.children}
  </SelectableGroup>
)

const GroupNav = (props: Props<HTMLDivElement>) => (
  <SelectableGroup {...props} props={props} As="nav">
    {props.children}
  </SelectableGroup>
)

export const group = {
  div: GroupDiv,
  nav: GroupNav,
}
