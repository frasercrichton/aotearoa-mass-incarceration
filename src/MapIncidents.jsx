import React, { useContext, useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { LatLng } from 'leaflet'
import { CircleMarker } from 'react-leaflet'
import MapContext from './MapContext'
import { incrementCapacityCount } from './actions'

const unselectedStyle = {
  stroke: 0
}

const selectedStyle = {
  stroke: 1,
  weight: 5,
  color: '#6653ff',
  dashArray: 2
}

const updatePrisons = (prisons, item) => {
  return prisons.map(prison => {
    delete prison.selected
    if (prison.prisonName === item.prisonName) {
      prison.selected = 'selected'
    }
    return prison
  })
}

const MapIncidents = () => {
  const dispatch = useDispatch()
  const { prisons, setPrisons, selectedPrison } = useContext(MapContext)
  const [prisonsAnimation, setPrisonsAnimation] = useState([])
  const circleMarkers = useRef([])
  const count = useRef(1856)

  const selectCircleMarker = (id) => {
    circleMarkers.current.forEach(element => {
      if (element.options.className.includes(id)) {
        element.setStyle(selectedStyle)
      } else {
        element.setStyle(unselectedStyle)
      }
    })
  }

  useEffect(() => {
    if (!prisons[0]) {
      return
    }
    const interval = setInterval(() => {
      if (count.current++ === prisons[prisonsAnimation.length].opened) {
        dispatch(incrementCapacityCount(prisons[prisonsAnimation.length].capacity))
        setPrisonsAnimation([...prisonsAnimation, prisons[prisonsAnimation.length]])
        return ''
      } else {
        return () => clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [prisonsAnimation, prisons, dispatch])

  useEffect(() => {
    selectCircleMarker(selectedPrison)
  }, [selectedPrison])

  const handleMapIncidentClick = (e, item) => {
    selectCircleMarker(item.id)
    const update = updatePrisons(prisons, item)

    setPrisons([...update])
  }

  const calculateRadius = (item) => {
    const radius = 10 * Math.log(item.capacity / 50)

    return radius
  }

  const selectedClassName = (item) => {
    return (item.selected === 'selected') ? 'prison-capacity active ' + item.id : 'prison-capacity ' + item.id
  }

  const createCircleMarker = (item, index) => {
    if (!item) {
      return
    }
    return (
      <CircleMarker
        ref={(element) => { circleMarkers.current[index] = element }}
        className={selectedClassName(item)}
        key={item.id}
        center={new LatLng(item.coordinates.latitude, item.coordinates.longitude)}
        fill='true'
        fillColor='#ffffff'
        fillOpacity='0.3'
        radius={calculateRadius(item)}
        stroke={false}
        eventHandlers={{
          click: (e) => {
            handleMapIncidentClick(e, item)
          }
        }}
      />
    )
  }

  return prisonsAnimation.map((item, index) => {
    return createCircleMarker(item, index)
  })
}

export default MapIncidents
