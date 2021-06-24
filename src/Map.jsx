import React from 'react'
import { LatLng } from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import MapIncidents from './MapIncidents'
import mapDisplay from './mapDisplay.json'

const MAP_LEAFLET_KEY = process.env.REACT_APP_MAP_LEAFLET_KEY
const MAP_LEAFLET_ID = process.env.REACT_APP_MAP_LEAFLET_ID

const { zoom, centre } = mapDisplay
const mapCentre = new LatLng(
  centre.latitude,
  centre.longitude
)

const mapZoomDimensions = {
  mapZoom: zoom.default,
  minZoom: zoom.minZoomCityBlock,
  maxZoom: zoom.maxZoomContinent
}

const Map = () => {
  const { mapZoom, maxZoom, minZoom, maxBounds } = mapZoomDimensions

  return (
    <div className='map-wrapper'>
      <MapContainer
      // onMoveend={this.displayMarkers}
        // fitBounds={maxBounds}
        maxBounds={maxBounds}
        center={mapCentre}
        zoomSnap='0.25'
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
