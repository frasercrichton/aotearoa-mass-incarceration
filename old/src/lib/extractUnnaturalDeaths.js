const createPrison = require('./data');

const extractUnnaturalDeaths = (facility) => {
  const data = [];
  Object.entries(facility).forEach(([key, value]) => {
    if (key.includes('unnatural') && value != '0' && key.includes('20')) {
      data.push({
        prisonName: facility.Prison,
        prisonId: createPrison.prisonKey(facility.Prison),
        year: key.replace('-unnatural', ''),
        count: Number(value),
      });
    }
  });
  data.sort((a, b) => a.year.localeCompare(b.year));

  return data;
};

const reduce = (array) => {
  const newArray = [];
  array.reduce((accumulator, {count}, index) => {
    newArray[index] = Object.assign(array[index], {sum: accumulator + count});
    return accumulator + count;
  }, 0);
  return newArray;
};

module.exports = {
  extractUnnaturalDeaths,
  reduce,
};
