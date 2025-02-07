import { HTMLAttributes } from 'react'
import { useSelectable } from './useSelectable'
import { SelectableType } from '../types'
import { MakeOptional } from '../../utils/types'

type Props<T extends HTMLElement> = MakeOptional<SelectableType<T>, 'id' | 'ref' | 'regionId'> & HTMLAttributes<T>

const SelectableDiv = (props: Props<HTMLDivElement>) => {
  const { props: propsToOverride } = useSelectable<HTMLDivElement>(props)

  return (
    <div tabIndex={-1} {...props} {...propsToOverride}>
      {props.children}
    </div>
  )
}

const SelectableButton = (props: Props<HTMLButtonElement>) => {
  const { props: propsToOverride } = useSelectable<HTMLButtonElement>(props)

  return (
    <button {...props} {...propsToOverride}>
      {props.children}
    </button>
  )
}

const SelectableInput = (props: Props<HTMLInputElement>) => {
  const { props: propsToOverride } = useSelectable<HTMLInputElement>(props)

  return (
    <input {...props} {...propsToOverride}>
      {props.children}
    </input>
  )
}

export const selectable = {
  div: SelectableDiv,
  button: SelectableButton,
  input: SelectableInput,
}
