import { createContext } from 'react'

const MapContext = createContext({
  mapZoom: '',
  setMapZoom: () => {}
})

export default MapContext
