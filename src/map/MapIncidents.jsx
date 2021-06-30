import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LatLng } from 'leaflet'
import { CircleMarker } from 'react-leaflet'
import {
  incrementCapacityCount,
  incrementCurrentDate,
  updateDisplayPrisons,
  updateSelectedPrison,
  togglePlayState
} from '../actions'
import {
  prisonsDomainState,
  domainState,
  selectedPrisonDomainState,
  currentDateDomainState
} from '../selectors'

const unselectedStyle = {
  stroke: 0
}

const selectedStyle = {
  stroke: 1,
  weight: 5,
  color: '#6653ff',
  dashArray: 2
}

const MapIncidents = () => {
  const dispatch = useDispatch()
  const prisons = useSelector(prisonsDomainState)
  const { displayPrisons } = useSelector(domainState)
  const selectedPrison = useSelector(selectedPrisonDomainState)
  const currentDate = useSelector(currentDateDomainState)

  const circleMarkers = useRef([])

  const selectCircleMarker = (id) => {
    circleMarkers.current.forEach(element => {
      if (element.options.className.includes(id)) {
        element.setStyle(selectedStyle)
      } else {
        element.setStyle(unselectedStyle)
      }
    })
  }
  const endDate = 2021

  useEffect(() => {
    if (!prisons.length > 0) {
      return
    }
    // same year
    const interval = setInterval(() => {
      if (currentDate < endDate) {
        dispatch(incrementCurrentDate())
      }
      const currentPrison = prisons[displayPrisons.length]

      if (currentDate === currentPrison.opened) {
        if (!currentPrison.closed) {
          dispatch(incrementCapacityCount(currentPrison.capacity))
        }

        dispatch(updateDisplayPrisons(currentPrison))
        return ''
      } else {
        return () => clearInterval(interval)
      }
    }, 100)
    if (currentDate === endDate) {
      dispatch(togglePlayState())
    }
    return () => clearInterval(interval)
  }, [dispatch, displayPrisons.length, prisons, currentDate])

  useEffect(() => {
    selectCircleMarker(selectedPrison)
  }, [selectedPrison])

  const handleMapIncidentClick = (e, item) => {
    selectCircleMarker(item.id)
    dispatch(updateSelectedPrison(item.id))
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

  const prisonList =
  displayPrisons.map((item, index) => {
    return createCircleMarker(item, index)
  })

  return prisonList
}

export default MapIncidents
