import * as d3 from 'd3';
import {numberAsPercentage, formatNumber} from './lib/mathFunctions';
const prisonMusterFile = 'data/prison-statistics/Ethnicity-Tabl.csv';
d3.csv(prisonMusterFile, function(d) {
  return {
    year: d.Year,
    total: formatNumber(d.Total),
    european: formatNumber(d.European),
    maori: formatNumber(d.Maori),
    pacific: formatNumber(d.Pacific),
    other: formatNumber(d.Other),
  };
}).then((data) => {
  function manipulate(capacity) {
    Caman('#test', function() {
      const x = Math.round(capacity / 100);
      this.revert(false);
      this.brightness(x);
      //      this.contrast(30);
      //    this.sepia(60);
      //  this.saturation(-30);
      this.render();
    });
  }

  const percentageOfMaoriIncarcerated = d3
      .nest()
      .key((d) => {
        return d.year;
      })
      .rollup((v) => {
        return d3.sum(v, (d) => {
          return numberAsPercentage(d.maori, d.total);
        });
      })
      .entries(data);

  console.log(percentageOfMaoriIncarcerated);

  percentageOfMaoriIncarcerated.forEach((element, index) => {
    setTimeout(manipulate, index * 1000, element.value);
  });
});
