import { useState } from 'react'
import { region } from '../arrow-navigation/region/Region'
import { selectable } from '../arrow-navigation/selectable/Selectables'
import { NavButton } from './NavButton'

const tabs = ['Pour vous', 'Chaînes', 'Replay', 'Ciné', 'VOD', 'Ma Liste'] as const

export const NavBar = () => {
  const [selected, setSelected] = useState<(typeof tabs)[number]>(tabs[0])

  return (
    <region.nav className="px-8 py-4 bg-[#1c1c1c] shadow-md">
      <div className="w-full max-w-[1400px] flex flex-row justify-between mx-auto">
        <div className="flex flex-row items-center gap-8 text-neutral-400 font-semibold text-base">
          <img src="https://oqee.tv/img/oqee-by-free1.svg" className="h-[35px] mr-4" alt="" />
          {tabs.map((tab, index) => (
            <NavButton key={index} label={tab} isSelected={selected === tab} onClick={() => setSelected(tab)} />
          ))}
        </div>
        <div className="flex flex-row items-center gap-4 text-neutral-400 font-semibold text-base">
          <selectable.button className="w-8 h-8 rounded-full bg-neutral-400 focus:outline-4 focus:outline-white" />
          <selectable.button className="w-8 h-8 rounded-full bg-amber-500 focus:outline-4 focus:outline-white" />
        </div>
      </div>
    </region.nav>
  )
}
