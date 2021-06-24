import * as d3 from 'd3';
const prisonMusterFile = 'data/prison-statistics/Prison Muster-Table 1.csv';
const loadGoogleMapsApi = require('load-google-maps-api');

const cities = [
  {name: 'Te Whanga-nui-a-Tara', translation: 'Wellington'},
  {name: 'Tāmaki-makau-rau', translation: 'Auckland'},
  {name: 'Waihopai', translation: 'Invercargill'},
  {name: 'Te Papa-i-Oea', translation: 'Palmerston North'},
  {name: 'Tauranga-moana', translation: 'Tauranga'},
  {name: 'Ahuriri', translation: 'Napier-Hastings'},
  {name: 'Ōtepoti', translation: 'Dunedin'},
  {name: 'Whakatū', translation: 'Nelson'},
  {name: 'Rotorua-nui-a-Kahu Matamōmoe', translation: 'Rotorua'},
  {name: 'Whangarei', translation: 'Whangarei'},
  {name: 'Whanganui', translation: 'Whanganui'},
  {name: 'Tūranga-nui-a-Kiwa', translation: 'Gisborne'},
  {name: 'Ngāmotu', translation: 'New Plymouth'}];


// Offence

// Trans prisoners in Aotearoa

// remand
// youth
let directionsService = null;
let directionsRenderer = null;
let streetViewService = null;
// {key: process.env.GOOGLEMAPS_KEY}
loadGoogleMapsApi(
).then(function(googleMaps) {
  const map = new googleMaps.Map(document.getElementById('map'), {
    disableDefaultUI: true,
    mapTypeControl: false,
    zoom: 6,
    center: {lat: -41.85, lng: 174.65},
  });

  directionsService = new googleMaps.DirectionsService();
  directionsRenderer = new googleMaps.DirectionsRenderer();
  streetViewService = new googleMaps.StreetViewService();
  directionsRenderer.setMap(map);

  //  173.8440853

  // arohata         position: {lat: -41.1855986, lng: 174.8274639},
  // 216.32


  // -35.3902508 173.8440853 3a%2C75y%2C354.52h
  const panorama = new googleMaps.StreetViewPanorama(
      document.getElementById('streetView'), {
        zoom: -10,
        disableDefaultUI: true,
        mapTypeControl: false,

        position: {lat: -35.3902508, lng: 173.8440853},
        pov: {heading: 354.52, pitch: 10},

      });
  map.setStreetView(panorama);
});


d3.csv(prisonMusterFile).then((data) => {
  cities.sort((a, b) => {
    return d3.ascending(a.translation, b.translation);
  });

  d3.select('.hometownContainer')
      .append('select')
      .attr('id', 'hometown')
      .selectAll('option')
      .data(cities)
      .enter()
      .append('option')
      .text(function(d) {
        return '(' + d.translation + ') ' + d.name;
      })
      .attr('value', function(d) {
        return d.name;
      });

  d3.select('.prisonNameContainer')
      .append('select')
      .attr('id', 'prisonName')
      .selectAll('option')
      .data(data)
      .enter()
      .append('option')
      .text(function(d) {
        return d.Prison;
      })
      .attr('value', function(d) {
        return d['Official Name'];
      });

  document
      .getElementById('hometown').addEventListener('change', onChangeHandler);
  document
      .getElementById('prisonName').addEventListener('change', onChangeHandler);
});


const onChangeHandler = () => {
  calculateAndDisplayRoute(directionsService, directionsRenderer);
};


const calculateAndDisplayRoute = (directionsService, directionsRenderer) => {
  const hometownSelect = document.getElementById('hometown');
  const prisonNameSelect = document.getElementById('prisonName');
  const prisonNameText = document.getElementById('prisonNameText').textContent = prisonNameSelect.value;

  // panorama = new googleMaps.StreetViewPanorama(document.getElementById('streetView'));

  directionsService.route(
      {
        origin: {query: hometownSelect.value},
        destination: {query: prisonNameSelect.value},
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
        durationInTraffic: true,
      },
      (response, status) => {
        if (status === 'OK') {
          document.getElementById('duration').textContent =
            'Duration: ' + response.routes[0].legs[0].duration_in_traffic.text;
          directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });

  console.log('xx');


  streetViewService.getPanoramaByLocation({
    location: prisonNameSelect.value,
  },
  50,
  function(response, status) {
    if (status === 'OK') {
      console.log('xx' + response.location.pano);

      // map.setStreetView(panorama);

      document.getElementById('streetView').textContent = response.location.pano;
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
};
