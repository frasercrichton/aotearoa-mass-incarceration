import * as d3 from 'd3';
d3.json('node_modules/d3-geomap/dist/topojson/countries/NZL.json').then(
    (data) => {
      console.log(data);
    }
);
