import { ReactNode, useRef } from 'react'
import { region } from '../arrow-navigation/region/Region'
import { EnteringPolicy } from '../arrow-navigation/region/entering-policy'

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
      <region.div
        ref={divRef}
        onElementFocused={(selectable) => {
          if (!selectable.ref.current) return
          divRef.current?.scrollTo({
            left: selectable.ref.current.offsetLeft - divRef.current.getBoundingClientRect().width * 0.5,
            behavior: 'smooth',
          })
        }}
        enteringPolicy={EnteringPolicy.Last}
        className="flex flex-row gap-4 py-4 px-4 -mx-4 overflow-x-hidden w-full"
      >
        {children}
      </region.div>
    </div>
  )
}
