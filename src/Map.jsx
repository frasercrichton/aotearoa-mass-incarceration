import React, { useState, useRef, useContext } from 'react'
import { LatLng } from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import MapIncidents from './MapIncidents'
import mapDisplay from './mapDisplay.json'
import { useDispatch } from 'react-redux'
import MapContext from './MapContext'
import { incrementCapacityCount, updateCurrentDate } from './actions'

const MAP_LEAFLET_KEY = process.env.REACT_APP_MAP_LEAFLET_KEY
const MAP_LEAFLET_ID = process.env.REACT_APP_MAP_LEAFLET_ID

const { zoom, centre } = mapDisplay
const mapCentre = new LatLng(
  centre.latitude,
  centre.longitude
)

const mapZoomDimensions = {
  zoomSnap: zoom.zoomSnap,
  mapZoom: zoom.default,
  minZoom: zoom.minZoomCityBlock,
  maxZoom: zoom.maxZoomContinent
}

const Map = () => {
  const dispatch = useDispatch()

  const { mapZoom, maxZoom, minZoom, maxBounds, zoomSnap } = mapZoomDimensions
  const { prisons } = useContext(MapContext)
  const [prisonsAnimation, setPrisonsAnimation] = useState([])

  const count = useRef(1856)

  const [playState, setPlayState] = useState(true)

  const playAnimation = () => {
    if (!prisons[0]) {
      return
    }
    const interval = setInterval(() => {
      const incrementedCount = count.current++
      if (incrementedCount <= prisons[prisons.length - 1].opened) {
        dispatch(updateCurrentDate(count.current))
      }
      const currentPrison = prisons[prisonsAnimation.length]
      if (incrementedCount === currentPrison.opened) {
        dispatch(incrementCapacityCount(currentPrison.capacity))
        setPrisonsAnimation([...prisonsAnimation, currentPrison])
        return ''
      } else {
        return () => clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }

  const play = () => {
    //  disable on run
    setPlayState(!playState)
    playAnimation()
  }

  const playIcon = (playState) ? 'play_circle_outline' : 'play_circle_filled'

  return (
    <div className='map-wrapper'>
      <div className='play-icon-wrapper'>
        <button
          className='material-icons play-icon material-icons-outlined'
          onClick={() => play()}
        >
          {playIcon}
        </button>
      </div>
      <MapContainer
      // onMoveend={this.displayMarkers}
        // fitBounds={maxBounds}
        maxBounds={maxBounds}
        center={mapCentre}
        zoomSnap={zoomSnap}
        zoom={mapZoom}
        maxZoom={maxZoom}
        minZoom={minZoom}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/${MAP_LEAFLET_ID}/tiles/256/{z}/{x}/{y}@2x?access_token=${MAP_LEAFLET_KEY}&fresh=true`}
          attribution='Map data &copy;
          <a target="_blank" rel="noreferrer" href="https://www.openstreetmap.org/">OpenStreetMap</a>
          contributors,
          <a  target="_blank" rel="noreferrer" href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
          Imagery &copy;
          <a  target="_blank" rel="noreferrer" href="https://www.mapbox.com/">Mapbox</a>'
        />
        <MapIncidents />
      </MapContainer>

    </div>
  )
}
export default Map
