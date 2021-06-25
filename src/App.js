import React, { useEffect, useState } from 'react'
import './App.css'
import Map from './Map'
import Metrics from './Metrics'
import MapContext from './MapContext'
import * as d3 from 'd3'
import { zoom, centre } from './mapDisplay.json'
import { createPrison } from './domainAugment'
import prisonMusterFile from './prisons.csv'
import { useSelector } from 'react-redux'
import { capacityCountDomainState } from './selectors'

function App () {
  const capacityCount = useSelector(capacityCountDomainState)

  const mapDisplay = {
    centre,
    zoom: zoom.default
  }

  const [mapZoom, setMapZoom] = useState(mapDisplay)
  const [prisons, setPrisons] = useState([])
  const [selectedPrison, setSelectedPrison] = useState('')
  const setActiveZoom = (active) => { setMapZoom(active) }

  useEffect(() => {
    d3.csv(prisonMusterFile, (facility) => {
      return createPrison(facility)
    }).then((data) => {
      data.sort((a, b) => {
        return d3.ascending(a.opened, b.opened)
      })
      setPrisons(data)
    })
  }, [])

  return (
    <div className='App'>
      <MapContext.Provider value={{
        prisons,
        setPrisons,
        mapZoom,
        setMapZoom: setActiveZoom,
        selectedPrison,
        setSelectedPrison: setSelectedPrison,
      }}
      >
        <Map />
        <div className='metrics-wrapper'>
          <h1>Mass Incarceration {capacityCount}</h1>
          <div className='prison-list'>
            <Metrics />
          </div>
        </div>
      </MapContext.Provider>
    </div>
  )
}

export default App
