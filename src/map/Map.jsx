import React from 'react'
import { LatLng } from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux'
import MapIncidents from './MapIncidents'
import mapDisplay from './mapDisplay.json'
import { resetDisplayPrisons, togglePlayState } from '../actions'
import { playStateDomainState } from '../selectors'
const MAP_LEAFLET_KEY = process.env.REACT_APP_MAP_LEAFLET_KEY
const MAP_LEAFLET_ID = process.env.REACT_APP_DARK_MAP_LEAFLET_ID

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
  const playState = useSelector(playStateDomainState)
  const playAnimation = () => {
    dispatch(resetDisplayPrisons())
  }

  const play = () => {
    if (!playState) {
      dispatch(togglePlayState())
      playAnimation()
    }
  }

  const playIcon = (playState) ? 'play_circle_filled' : 'play_circle_outline'

  return (
    <div className='map-wrapper'>
      <div className='play-icon-wrapper'>
        <a
          className='material-icons play-icon material-icons-outlined'
          onClick={() => play()}
        >
          {playIcon}
        </a>
      </div>
      <MapContainer
      // onMoveend={this.displayMarkers}
        fitBounds={maxBounds}
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
