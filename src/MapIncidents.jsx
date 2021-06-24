import React, { useContext, useEffect, useState, useRef } from 'react'
import { LatLng } from 'leaflet'
import { CircleMarker } from 'react-leaflet'
import MapContext from './MapContext'

const unselectedStyle = {
  stroke: 0
}

const selectedStyle = {
  // className: 'selected',
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
  const { prisons, setPrisons, selectedPrison } = useContext(MapContext)
  const [prisonsAnimation, setPrisonsAnimation] = useState([])
  const [clicked, setClicked] = useState()

  const circleMarkers = useRef([])

  useEffect(() => {
    const interval = setInterval(() => {
      if (prisonsAnimation.length <= prisons.length) {
        setPrisonsAnimation([...prisonsAnimation, prisons[prisonsAnimation.length]])
      } else {
        return () => clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [prisonsAnimation, prisons])

  useEffect(() => {
    circleMarkers.current.map(element => {
      if (element.options.className.includes(selectedPrison)) {
        element.setStyle(selectedStyle)
      } else {
        element.setStyle(unselectedStyle)
      }
      return ''
    })
  }, [selectedPrison])

  const selectedClassName = (item) => {
    return (item.selected === 'selected') ? 'prison-capacity active ' + item.id : 'prison-capacity ' + item.id
  }

  const handleMapIncidentClick = (e, item) => {
    if (clicked) {
      clicked.setStyle(unselectedStyle)
    }

    e.target.setStyle(selectedStyle)

    setClicked(e.target)

    const update = updatePrisons(prisons, item)

    setPrisons([...update])

    circleMarkers.current[10].setStyle(selectedStyle)
  }

  const calculateRadius = (item) => 20 * Math.log(item.capacity / 100)

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
