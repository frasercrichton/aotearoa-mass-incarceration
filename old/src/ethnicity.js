import * as d3 from 'd3';
const prisonMusterFile = 'data/prison-statistics/Sheet 1-Ethicity.csv';
import {formatNumber} from './lib/format';

const margin = {top: 10, right: 30, bottom: 30, left: 50};
const width = 760 - margin.left - margin.right;
const height = 860 - margin.top - margin.bottom;

const svg = d3
    .select('div.map')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const x = d3
    .scaleLinear()
    .domain([1980, 2007])
    .range([0, width]);

d3.csv(prisonMusterFile, (data) => {
  return {
    year: data.BALANCE_DATE.split('/')[2],
    total: formatNumber(data.Total),
    european: formatNumber(data.European),
    maori: formatNumber(data.Maori),
    pacific: formatNumber(data.Pacific),
    other: formatNumber(data.Other),
  };
}).then((data) => {
  svg
      .append('g')
      .attr('transform', 'translate(0,' + (height + 5) + ')')
      .call(
          d3
              .axisBottom(x)
              .ticks(5)
              .tickSizeOuter(0)
              .tickFormat(d3.format('d'))
      );

  const y = d3
      .scaleLinear()
      .domain(
          d3.extent(data, function(d) {
            return +d.maori;
          })
      )
      .range([height, 0]);

  svg
      .append('g')
      .attr('transform', 'translate(-5,0)')
      .call(d3.axisLeft(y).tickSizeOuter(0));

  drawLine(svg, data);

  svg
      .append('path')
      .datum(data)
      .attr('fill', '#69b3a2')
      .attr('fill-opacity', 0.3)
      .attr('stroke', 'none')
      .attr(
          'd',
          d3
              .area()
              .x(function(d) {
                return x(d.year);
              })
              .y0(height)
              .y1(function(d) {
                return y(d.maori);
              })
      );

  svg
      .append('path')
      .datum(data)
      .attr('fill', '#69b3a2')
      .attr('fill-opacity', 0.3)
      .attr('stroke', 'none')
      .attr(
          'd',
          d3
              .area()
              .x(function(d) {
                return x(d.year);
              })
              .y0(height)
              .y1(function(d) {
                return y(d.european);
              })
      );
  svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#69b3a2')
      .attr('stroke-width', 4)
      .attr(
          'd',
          d3
              .line()
              .x(function(d) {
                return x(d.year);
              })
              .y(function(d) {
                return y(d.maori);
              })
      );

  svg
      .selectAll('myCircles')
      .data(data)
      .enter()
      .append('circle')
      .attr('fill', 'red')
      .attr('stroke', 'none')
      .attr('cx', function(d) {
        return x(d.year);
      })
      .attr('cy', function(d) {
        return y(d.maori);
      })
      .attr('r', 3);
});

const convertToYear = (date) => {
  console.log(date);
  const parts = date.split('/');
  console.log(parts[0]);

  return date;
};

const drawLine = (svg, data) => {
  const y = d3
      .scaleLinear()
      .domain(
          d3.extent(data, function(d) {
            return +d.maori;
          })
      )
      .range([height, 0]);

  svg
      .append('path')
      .datum(data)
      .attr('fill', '#69b3a2')
      .attr('fill-opacity', 0.3)
      .attr('stroke', 'none')
      .attr(
          'd',
          d3
              .area()
              .x(function(d) {
                return x(d.year);
              })
              .y0(height)
              .y1(function(d) {
                return y(d.maori);
              })
      );
};
