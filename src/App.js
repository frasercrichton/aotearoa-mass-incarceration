import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import Map from './Map'
import Metrics from './Metrics'
import MapContext from './MapContext'
import * as d3 from 'd3'
import { zoom, centre } from './mapDisplay.json'
import { createPrison } from './domainAugment'
import prisonMusterFile from './prisons.csv'
import { capacityCountDomainState, currentDateDomainState } from './selectors'
import { updatePrisons } from './actions'

function App () {
  const dispatch = useDispatch()
  const capacityCount = useSelector(capacityCountDomainState)
  const currentDate = useSelector(currentDateDomainState)
  const mapDisplay = {
    centre,
    zoom: zoom.default
  }

  const [mapZoom, setMapZoom] = useState(mapDisplay)
  const [selectedPrison, setSelectedPrison] = useState('')
  const setActiveZoom = (active) => { setMapZoom(active) }

  useEffect(() => {
    d3.csv(prisonMusterFile, (facility) => {
      return createPrison(facility)
    }).then((data) => {
      data.sort((a, b) => {
        return d3.ascending(a.opened, b.opened)
      })
      dispatch(updatePrisons(data))
    }).catch((error) => {
      // TODO update for notifications error
      // eslint-disable-next-line no-console
      console.log(error)
    })
  }, [dispatch])

  return (
    <div className='App'>
      <MapContext.Provider value={{
        mapZoom,
        setMapZoom: setActiveZoom
      }}
      >
        <Map />
        <div className='metrics-wrapper'>
          <h1>Mass Incarceration</h1>
          <h2>
            {currentDate} Capacity: {capacityCount}
          </h2>
          <div className='prison-list'>
            <Metrics />
            <div className='references-wrapper'>
              Department of Corrections figures:
              <a
                target='_blank'
                rel='noreferrer'
                href='https://www.corrections.govt.nz/resources/statistics/quarterly_prison_statistics'
              >
                Prison facts and statistics - March 2021
              </a>
            </div>
          </div>
        </div>
      </MapContext.Provider>
    </div>
  )
}

export default App
