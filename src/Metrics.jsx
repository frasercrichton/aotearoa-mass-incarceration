import React, { useContext } from 'react'
import MapContext from './MapContext'

const MapIncidents = () => {
  const { prisons, setPrisons, setSelectedPrison } = useContext(MapContext)

  const selectPrison = (item) => {
    // rapper
    // ReactDOM.findDOMNode(<instance-of-outermost-component>).getElementsByClassName('map-wrapper') // Returns the elements

    setSelectedPrison(item.id)
    const update = prisons.map(prison => {
      delete prison.selected
      if (prison.prisonName === item.prisonName) {
        prison.selected = 'selected'
      }
      return prison
    })

    setPrisons([...update])
  }

  const isClosedClassName = (item) => (item.closed !== 0) ? ' closed' : ''

  const selectedClassName = (item) => {
    return (item.selected) ? 'prison-details active ' + item.prisonName + isClosedClassName(item) : 'prison-details ' + item.prisonName + isClosedClassName(item)
  }

  const hasClosedText = (item) => (item.closed !== 0) ? `-${item.closed}` : ''

  return prisons.map((item) => {
    return (
      <div key={item.prisonName}>
        <p onClick={() => selectPrison(item)} className={selectedClassName(item)}>
          {item.correctionsName} ({item.opened}{hasClosedText(item)}) - {item.capacity}
        </p>
      </div>
    )
  })
}

export default MapIncidents
