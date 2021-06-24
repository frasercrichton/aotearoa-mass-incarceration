import * as d3 from 'd3';
import * as topojson from 'topojson';
import './css/main.css';
import { updateDataWithClosedPrisons } from './lib/capacityCount.js';
import { isCurrentYear, isBeforeThisYear } from './lib/dateUtility';
import {
  formatNumberWithSpaces,
  closed,
  commaDelimited,
} from './lib/format.js';
import { createPrison } from './lib/data';
import {
  getClosedPrisonList,
  getOpenedPrisonList,
  getPrisonsForYearList,
} from './lib/filter';

const aotearoaMapFile = 'data/NZL.json';
// const prisonMusterFile = 'data/test-data.csv';
const prisonMusterFile = 'data/prison-statistics/Prison Muster-Table 1.csv';
// const startYear = 2000
const colonisedYear = 1850;
// const startYear = 1300;
// const tasmanLandsYear = 1642;
const tasmanLandsYear = 1849;
const isToRunFromStart = true;

const width = 760;
const height = 660;

const yearDiv = d3.select('div.year');
const prisonNameDiv = d3.select('div.prison-name');

const svg = d3
  .select('div.map')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

let capacityText = null;

const mapCentreCoordinates = [173.63813018795, -41.5321824526];

const projection = d3
  .geoMercator()
  .translate([width / 2, height / 2])
  .center(mapCentreCoordinates)
  .scale(2000);

const yearLoop = (year, data, subunits) => {
  if (isBeforeThisYear(++year, colonisedYear)) {
    yearDiv.text(`[ ${year} ]`);
    return setTimeout(yearLoop, 1000, year, data, subunits);
  }
  // tasman lands
  return drawRegions(data, subunits);
  // prisons start getting built
};

d3.json(aotearoaMapFile).then((data) => {
  const subunits = topojson.feature(data, data.objects.units);
  svg
    .append('path')
    .datum(subunits)
    .attr('d', d3.geoPath().projection(projection))
    .attr('class', 'country');

  if (isToRunFromStart) {
    yearLoop(tasmanLandsYear, data, subunits);
  } else {
    drawRegions(data, subunits);
  }
});

const resetUI = (yearDiv, capacityText) => {
  d3.selectAll('circle').remove();
  yearDiv.text('');
  capacityText.text('');
};

const drawRegions = (data, subunits) => {
  const path = d3.geoPath().projection(projection);

  svg
    .selectAll('.unit')
    .data(subunits.features)
    .enter()
    .append('path')
    .attr('class', (d) => {
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

  capacityText = svg
    .append('text')
    .attr('opacity', 0.3)
    .attr('x', '25%')
    .attr('y', '55%');

  startPrisonExpansion();
};

const startPrisonExpansion = () => {
  resetUI(yearDiv, capacityText);

  d3.csv(prisonMusterFile, (facility) => {
    return createPrison(facility);
  }).then((data) => {
    data.sort((a, b) => {
      return d3.ascending(a.opened, b.opened);
    });

    function yearCounter(year, nationalCapacity) {
      yearDiv.text(`[ ${year} ]`);
      if (isCurrentYear(year)) {
        return year;
      }

      const capacity = updateDataWithClosedPrisons(data).find((element) => {
        return element.year === year;
      });

      if (capacity) {
        setTimeout(updateNationalCapacity, 2000, capacity);
      }

      setTimeout(updatePrisonMap, 2000, data, year);

      return setTimeout(yearCounter, 100, ++year, nationalCapacity);
    }

    yearCounter(colonisedYear, 0);
  });
};

const updatePrisonMap = (data, year) => {
  prisonNameDiv.text('');
  const prisonList = getPrisonsForYearList(data, year);

  const closedPrisons = getClosedPrisonList(prisonList, year).map((prison) => {
    return prison.prisonName;
  });

  const openedPrisons = getOpenedPrisonList(prisonList, year).map((prison) => {
    return prison.prisonName;
  });

  const xx = closed(closedPrisons);

  prisonNameDiv.text(`${commaDelimited(openedPrisons)} ${xx} `);

  prisonList.forEach((prison) => {
    updateMap(prison);
  });
};

const updateNationalCapacity = (capacity) => {
  capacityText
    .text(formatNumberWithSpaces(capacity.nationalCapacity))
    .attr('class', 'capacity-count');
};

const updateMap = (prison) => {
  const prisonCoordinates = [
    prison.coordinates.longitude,
    prison.coordinates.latitude,
  ];
  const circle = svg
    .append('circle')
    .attr('class', prison.prisonId)
    .attr('cx', projection(prisonCoordinates)[0])
    .attr('cy', projection(prisonCoordinates)[1])
    .attr('r', Math.round(prison.capacity / 30))
    .attr('fill', 'black')
    .style('opacity', 0.65);

  circle.append('svg:title').text(() => {
    return prison.prisonName + ' (Capacity: ' + prison.capacity + ')';
  });

  circle
    .transition()
    .duration(1500)
    .attr('r', '4');
};
