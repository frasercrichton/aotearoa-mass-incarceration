import * as d3 from 'd3';
import {createPrison} from './lib/data';
const width = 960;
const height = 1160;

const svg = d3
    .select('div.map')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const projection = d3
    .geoMercator()
    .translate([width / 2, height / 2])
    .center([172.63813018795, -43.5321824526])
    .scale(2500);

const path = d3.geoPath().projection(projection);

d3.json('node_modules/d3-geomap/dist/topojson/countries/NZL.json').then(
    function(data) {
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
              topojson.mesh(data, data.objects.units, function(a, b) {
                return a !== b;
              })
          )
          .attr('d', path)
          .attr('class', 'unit-boundary');

      d3.csv('data/prison-statistics/Prison Muster-Table 1.csv', (facility) => {
        return createPrison(facility);
      }).then((data) => {
        data.sort(function(a, b) {
          return d3.ascending(a.opened, b.opened);
        });

        svg
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .style('opacity', 0)
            .attr('cx', function(d) {
              return projection(d.coordinates)[0];
            })
            .attr('cy', function(d) {
              return projection(d.coordinates)[1];
            })
            .attr('r', function(d) {
              return Math.round(d.capacity / 60);
            })

            .attr('fill', 'black');

        svg
            .selectAll('circle')
            .transition()
            .duration(2000)
            .delay(function(d, i) {
              const x = -(Number(new Date().getFullYear()) - Number(d.opened));
              const y = Number(x) + Number(159);
              return y * 100;
            })
            .style('opacity', 0.65)
            .transition()
            .duration(1500)
            .attr('r', '3');

        const text = svg
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .transition()
            .duration(2000)
            .delay(function(d, i) {
              const x = -(Number(new Date().getFullYear()) - Number(d.opened));
              const y = Number(x) + Number(159);
              return y * 100;
            })
            .style('opacity', 0.65)
            .transition()
            .duration(1500)
            .attr('x', function(d) {
              return projection(d.coordinates)[0];
            })
            .attr('y', function(d) {
              return projection(d.coordinates)[1];
            })
            .text(function(d) {
              return d.prisonName;
            })
            .attr('font-size', '10px')
            .attr('fill', 'black');
      });

      const format = d3.format(',d');

      d3.select('#test')
          .transition()
          .duration(2500)
          .on('start', function repeat() {
            const t = d3
                .active(this)
                .style('opacity', 0)
                .remove();

            d3.select('body')
                .append('h1')
                .style('opacity', 0)
                .text(format(Math.random() * 1e6))
                .transition(t)
                .style('opacity', 1)
                .transition()
                .delay(1500)
                .on('start', repeat);
          });
    }
);
