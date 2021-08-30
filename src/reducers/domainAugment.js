const createPrison = (facility) => {
  return {
    prisonName: facility.Prison,
    correctionsName: facility['Official Name'],
    id: prisonKey(facility.Prison),
    opened: +facility.Opened,
    closed: +facility.Closed,
    capacity: +facility.Capacity,
    coordinates: {
      longitude: +facility.Longitude,
      latitude: +facility.Latitude
    }
  }
}

const prisonKey = (name) => {
  return name
    .replace(/'/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

module.exports = {
  createPrison,
  prisonKey
}
