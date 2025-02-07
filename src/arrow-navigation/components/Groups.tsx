import { HTMLAttributes } from 'react'
import { SelectableGroup, SelectableGroupProps } from '../group/SelectableGroup'
import { isKeyOf } from '../../utils/isKeyOf'

type PropsOfGroup = Omit<SelectableGroupProps, 'As' | 'props'>

type Props<T extends HTMLElement> = PropsOfGroup & HTMLAttributes<T>

const GroupDiv = (props: Props<HTMLDivElement>) => {
  const propsOfGroup: PropsOfGroup = {
    children: props.children,
    enteringPolicy: props.enteringPolicy,
    id: props.id,
    onElementFocused: props.onElementFocused,
    onGroupLeaved: props.onGroupLeaved,
    ref: props.ref,
  }

  const propsOfElement = Object.keys(props).reduce((acc, key) => {
    if (!key || isKeyOf(propsOfGroup, key)) return acc
    const castedKey = key as keyof HTMLAttributes<HTMLDivElement>
    acc[castedKey] = props[castedKey]

    return acc
  }, {} as HTMLAttributes<HTMLDivElement>)

  return (
    <SelectableGroup {...propsOfGroup} props={propsOfElement} As="div">
      {props.children}
    </SelectableGroup>
  )
}

const GroupNav = (props: Props<HTMLDivElement>) => {
  const propsOfGroup: PropsOfGroup = {
    children: props.children,
    enteringPolicy: props.enteringPolicy,
    id: props.id,
    onElementFocused: props.onElementFocused,
    onGroupLeaved: props.onGroupLeaved,
    ref: props.ref,
  }

  const propsOfElement = Object.keys(props).reduce((acc, key) => {
    if (!key || isKeyOf(propsOfGroup, key)) return acc
    const castedKey = key as keyof HTMLAttributes<HTMLDivElement>
    acc[castedKey] = props[castedKey]

    return acc
  }, {} as HTMLAttributes<HTMLDivElement>)

  return (
    <SelectableGroup {...propsOfGroup} props={propsOfElement} As="nav">
      {props.children}
    </SelectableGroup>
  )
}

export const group = {
  div: GroupDiv,
  nav: GroupNav,
}
