import { group } from './arrow-navigation/components/Groups'
import { selectable } from './arrow-navigation/components/Selectables'
import { SelectionController } from './arrow-navigation/controller/SelectionController'
import { MovieCategory } from './movies/MovieCategory'
import { NavBar } from './navbar/NavBar'

function App() {
  return (
    <SelectionController>
      <NavBar />
      <div className="flex w-full flex-row max-w-[1400px] p-4 mx-auto mt-8">
        <div className="w-full flex flex-col gap-8 max-w-[1000px]">
          <MovieCategory label="En ce moment sur OQEE Ciné">
            {Array.from({ length: 20 }).map((_, index) => (
              <selectable.div
                key={index}
                className="h-44 aspect-[1/1.5] bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105"
              />
            ))}
          </MovieCategory>
          <MovieCategory label="Vos genres préférés">
            {Array.from({ length: 7 }).map((_, index) => (
              <selectable.div
                key={index}
                className="h-60 aspect-video bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105"
              />
            ))}
          </MovieCategory>
          <MovieCategory label="Les 20 plus vus de 2024">
            {Array.from({ length: 20 }).map((_, index) => (
              <selectable.div
                key={index}
                className="h-44 aspect-[1/1.5] bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105"
              />
            ))}
          </MovieCategory>
          <MovieCategory label="Les 30 plus vus de 2024">
            {Array.from({ length: 20 }).map((_, index) => (
              <selectable.div
                key={index}
                className="h-44 aspect-[1/1.5] bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105"
              />
            ))}
          </MovieCategory>
          <MovieCategory label="Les 40 plus vus de 2024">
            {Array.from({ length: 20 }).map((_, index) => (
              <selectable.div
                key={index}
                className="h-44 aspect-[1/1.5] bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105"
              />
            ))}
          </MovieCategory>
          <MovieCategory label="Les 50 plus vus de 2024">
            {Array.from({ length: 20 }).map((_, index) => (
              <selectable.div
                key={index}
                className="h-44 aspect-[1/1.5] bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105"
              />
            ))}
          </MovieCategory>
        </div>
        <group.div className="flex w-full flex-col gap-4">
          <selectable.div className="h-20 aspect-[16/9] bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105" />
          <selectable.div className="h-20 aspect-[16/9] bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105" />
          <selectable.div className="h-20 aspect-[16/9] bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105" />
          <selectable.div className="h-20 aspect-[16/9] bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105" />
          <selectable.div className="h-20 aspect-[16/9] bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105" />
          <selectable.div className="h-20 aspect-[16/9] bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105" />
          <selectable.div className="h-20 aspect-[16/9] bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105" />
          <selectable.div className="h-20 aspect-[16/9] bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105" />
          <selectable.div className="h-20 aspect-[16/9] bg-red-600 rounded-xl focus:outline-4 focus:outline-white transition-all focus:scale-105" />
        </group.div>
      </div>
    </SelectionController>
  )
}

export default App
