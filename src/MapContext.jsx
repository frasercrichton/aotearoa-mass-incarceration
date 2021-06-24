import { createContext } from 'react'

const MapContext = createContext({
  prisons: [],
  setPrisons: () => {},
  mapZoom: '',
  setMapZoom: () => {},
  selectedPrison: '',
  setSelectedPrison: () => {}
})

export default MapContext
