import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { selectable } from './arrow-navigation/components/Selectables'

type ButtonProps = {
  children: ReactNode
  className?: string
}

export const Button = ({ className, children }: ButtonProps) => (
  <selectable.button className={twMerge('p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black', className)}>
    {children}
  </selectable.button>
)
