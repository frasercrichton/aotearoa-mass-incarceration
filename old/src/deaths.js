import * as d3 from 'd3';
import * as topojson from 'topojson';
import './css/main.css';
import {
  extractUnnaturalDeaths,
  reduce,
} from './lib/extractUnnaturalDeaths.js';
import {createPrison} from './lib/data';
import {getCurrentYear} from './lib/dateUtility';

const cumulativeDeathsFile = 'data/prison-statistics/Deaths-Cumulative.csv';
const aotearoaMapFile = 'data/NZL.json';
const width = 760;
const height = 660;

const svg = d3
    .select('div.map')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const projection = d3
    .geoMercator()
    .translate([width / 2, height / 2])
    .center([173.63813018795, -41.5321824526])
    .scale(2000);

const path = d3.geoPath().projection(projection);

function prisonKey(d) {
  return d.prisonId;
}

d3.json(aotearoaMapFile).then(function(data) {
  const subunits = topojson.feature(data, data.objects.units);

  svg
      .append('path')
      .datum(subunits)
      .attr('d', d3.geoPath().projection(projection));

  svg
      .selectAll('.unit')
      .data(subunits.features)
      .enter()
      .append('path')
      .attr('class', function(d) {
        return 'unit ' + d.properties.fips + ' ' + d.properties.name;
      })
      .attr('d', path);

  svg
      .append('path')
      .datum(
          topojson.mesh(data, data.objects.units, (a, b) => {
            return a !== b;
          })
      )
      .attr('d', path)
      .attr('class', 'unit-boundary');

  d3.csv('data/prison-statistics/Prison Muster-Table 1.csv', (facility) => {
    return createPrison(facility);
  }).then((result) => {
    result.sort(function(a, b) {
      return d3.ascending(a.opened, b.opened);
    });
    svg
        .selectAll('circle')
        .data(result)
        .enter()
        .append('circle')
        .attr('class', function(d) {
          return d.prisonId;
        })
        .attr('cx', function(d) {
          return projection([
            +d.coordinates.longitude,
            +d.coordinates.latitude,
          ])[0];
        })
        .attr('cy', function(d) {
          return projection([
            +d.coordinates.longitude,
            +d.coordinates.latitude,
          ])[1];
        })
        .attr('r', function(d) {
          return Math.round(d.capacity / 60);
        })
        .attr('fill', 'black');

    d3.csv(cumulativeDeathsFile, function(facility) {
      const array = extractUnnaturalDeaths(facility);
      return reduce(array);
    }).then((result) => {
      result.sort(function(a, b) {
        return d3.ascending(a.year, b.year);
      });

      const data = d3
          .nest()
          .key(function(d) {
            return d[0].prisonId;
          })
          .entries(result.filter(String));

      const nested = generateKeys(result.filter(String));
      nested.forEach(function(d) {
        d3.selectAll('circle')
            .data(d.values, prisonKey)
            .transition()
            .duration(15000)
            .delay(1000)
            .filter(function(d) {
              return this.classList.contains(d.prisonId);
            })
            .attr('r', function(d) {
              console.log(d.sum);
              const x = d.sum * 5;
              return Number(this.r.baseVal.value) + x;
            })
            .style('opacity', 0.5)
            .attr('fill', 'red');
      });
    });
  });
});

const calculateDelay = () => {
  return (d, i) => {
    const x = -(getCurrentYear - +d.opened);
    const y = x + 159;
    return y * 100;
  };
};

const generateKeys = (result) => {
  return d3
      .nest()
      .key((d) => {
        return d.year;
      })
      .entries(result.flat());
};
