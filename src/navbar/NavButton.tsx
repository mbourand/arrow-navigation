import { selectable } from '../arrow-navigation/components/Selectables'
import { twMerge } from 'tailwind-merge'

type NavButtonBase = {
  label: string
  isSelected?: boolean
}

type LinkButton = NavButtonBase & { href: string }
type ClickButton = NavButtonBase & { onClick: () => void }

type NavButtonProps = LinkButton | ClickButton

export const NavButton = (props: NavButtonProps) => {
  return (
    <selectable.button
      className={twMerge(
        'rounded-full py-2 px-4 focus:bg-white focus:text-black font-bold text-neutral-400 focus:outline-none',
        props.isSelected && 'bg-red-700 text-white'
      )}
      onClick={'onClick' in props ? props.onClick : () => window.open(props.href, '_blank')}
    >
      {props.label}
    </selectable.button>
  )
}
