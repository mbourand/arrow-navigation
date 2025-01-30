import { HTMLAttributes } from 'react'
import { Selectable, SelectableProps } from '../selectable/Selectable'

type Props<T extends HTMLElement> = Omit<SelectableProps, 'As' | 'props'> & HTMLAttributes<T>

const SelectableDiv = (props: Props<HTMLDivElement>) => (
  <Selectable {...props} props={props} As="div">
    {props.children}
  </Selectable>
)

const SelectableButton = (props: Props<HTMLButtonElement>) => (
  <Selectable {...props} props={props} As="button">
    {props.children}
  </Selectable>
)

const SelectableInput = (props: Props<HTMLInputElement>) => (
  <Selectable {...props} props={props} As="input">
    {props.children}
  </Selectable>
)

export const selectable = {
  div: SelectableDiv,
  button: SelectableButton,
  input: SelectableInput,
}
