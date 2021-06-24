import React, { useContext, useEffect, useState } from 'react'
import * as d3 from 'd3'
import MapContext from './MapContext'
import mapDisplay from './mapDisplay.json'

const { centre } = mapDisplay
const mapCentre = [
  centre.latitude,
  centre.longitude
]

const width = 760
const height = 660

const svg = d3
  .select('div.map')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

const MapIncidents = () => {
  const { prisons, setPrisons } = useContext(MapContext)

  const [prisonsAnimation, setPrisonsAnimation] = useState([])

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

  const activeClassName = (item) => {
    return (item.selected === 'selected') ? 'prison-capacity active ' + item.prisonName : 'prison-capacity ' + item.prisonName
  }

  const projection = d3
    .geoMercator()
    .translate([width / 2, height / 2])
    .center(mapCentre)
    .scale(2000)

  const prisonCoordinates = [
    prison.coordinates.longitude,
    prison.coordinates.latitude
  ]
  const circle = svg
    .append('circle')
    .attr('class', prison.prisonId)
    .attr('cx', projection(prisonCoordinates)[0])
    .attr('cy', projection(prisonCoordinates)[1])
    .attr('r', Math.round(prison.capacity / 30))
    .attr('fill', 'black')
    .style('opacity', 0.65)

  const handleMapIncidentClick = (e, item) => {
    console.log(e)
    console.log(item)

    e.target.setStyle({
      className: 'active'
    })

    const update = prisons.map(prison => {
      delete prison.selected
      if (prison.prisonName === item.prisonName) {
        prison.selected = 'selected'
      }
      return prison
    })

    setPrisons([...update])
  }

  const makeCircle = (item) => {
    if (!item) {
      return
    }
    console.log('updatung')
    return (
      <CircleMarker
      // zIndex={zIndex}
      // pane={category}
        className={activeClassName(item)}
        fill='true'
        fillColor='#ffffff'
        fillOpacity='0.3'
        key={item.id}
        center={new LatLng(item.coordinates.latitude, item.coordinates.longitude)}
        radius={20 * Math.log(item.capacity / 100)}
        stroke={false}
        eventHandlers={{
          click: (e) => {
            handleMapIncidentClick(e, item)
          }
        }}
      />
    )
  }

  return prisonsAnimation.map((item) => {
    return makeCircle(item)
  })
}

export default MapIncidents
