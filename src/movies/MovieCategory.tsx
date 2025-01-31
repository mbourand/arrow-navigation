import { ReactNode, useRef } from 'react'
import { group } from '../arrow-navigation/components/Groups'
import { EnteringPolicy } from '../arrow-navigation/group/entering-policy'

type MovieCategoryProps = {
  className?: string
  label: string
  children: ReactNode
}

export const MovieCategory = ({ label, children, className }: MovieCategoryProps) => {
  const divRef = useRef<HTMLDivElement>(null)

  return (
    <div className={className}>
      <h1 className="text-2xl">{label}</h1>
      <group.div
        ref={divRef}
        onGroupLeaved={() => divRef.current?.scrollTo({ left: 0, behavior: 'smooth' })}
        onElementFocused={(selectable) =>
          selectable.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
        }
        enteringPolicy={EnteringPolicy.Left}
        className="flex p-4 flex-row gap-4 w-[calc(100%_+_16px)] overflow-x-hidden -translate-x-4 -pr-4"
      >
        {children}
      </group.div>
    </div>
  )
}
