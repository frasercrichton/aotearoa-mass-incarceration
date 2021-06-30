import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import * as d3 from 'd3'
import './App.css'
import Map from './map/Map'
import Metrics from './Metrics'
import { createPrison } from './domainAugment'
import prisonMusterFile from './data/prisons.csv'
import { updatePrisons } from './actions'

function App () {
  const dispatch = useDispatch()

  useEffect(() => {
    d3.csv(prisonMusterFile, (facility) => {
      return createPrison(facility)
    }).then((data) => {
      data.sort((a, b) => {
        return d3.ascending(a.opened, b.opened)
      })
      dispatch(updatePrisons(data))
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
    })
  }, [dispatch])

  return (
    <div className='App'>
      <Map />
      <Metrics />
    </div>
  )
}

export default App
