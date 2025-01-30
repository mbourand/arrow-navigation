import { selectable } from './arrow-navigation/components/Selectables'
import { SelectionController } from './arrow-navigation/controller/SelectionController'
import { EnteringPolicy } from './arrow-navigation/group/entering-policy'
import { SelectableGroup } from './arrow-navigation/group/SelectableGroup'

function App() {
  return (
    <SelectionController>
      <SelectableGroup enteringPolicy={EnteringPolicy.FromDirection}>
        <h1 className="text-4xl mb-4">Pour vous</h1>
        <div className="flex flex-row gap-8">
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            10
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            11
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            12
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            13
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            14
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            15
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            16
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            17
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            18
          </selectable.button>
        </div>
      </SelectableGroup>
      <h1 className="text-4xl mb-4">A la une</h1>
      <SelectableGroup enteringPolicy={EnteringPolicy.Left}>
        <div className="grid grid-cols-3 gap-8">
          <selectable.button className="p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            1
          </selectable.button>
          <selectable.button className="p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            2
          </selectable.button>
          <selectable.button className="p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            3
          </selectable.button>
          <selectable.button className="p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            4
          </selectable.button>
          <selectable.button className="p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            5
          </selectable.button>
          <selectable.button className="p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            6
          </selectable.button>
          <selectable.button className="p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            7
          </selectable.button>
          <selectable.button className="p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            8
          </selectable.button>
          <selectable.button className="p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            9
          </selectable.button>
        </div>
      </SelectableGroup>
      <div className="mt-16"></div>
      <SelectableGroup enteringPolicy={EnteringPolicy.Left}>
        <h1 className="text-4xl mb-4">Pour vous</h1>
        <div className="flex flex-row gap-8">
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            10
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            11
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            12
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            13
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            14
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            15
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            16
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            17
          </selectable.button>
          <selectable.button className="w-full p-4 bg-red-600 focus:bg-white focus:outline focus:outline-black">
            18
          </selectable.button>
        </div>
      </SelectableGroup>
    </SelectionController>
  )
}

export default App
