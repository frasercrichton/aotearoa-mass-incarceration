import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { domainState } from './selectors'
import { updateSelectedPrison } from './actions'

const MapIncidents = () => {
  const dispatch = useDispatch()
  const { displayPrisons } = useSelector(domainState)
  const selectPrison = (item) => {
    dispatch(updateSelectedPrison(item.id))
  }

  const isClosedClassName = (item) => (item.closed !== 0) ? ' closed' : ''

  const selectedClassName = (item) => {
    return (item.selected) ? 'prison-details active ' + item.prisonName + isClosedClassName(item) : 'prison-details ' + item.prisonName + isClosedClassName(item)
  }

  const hasClosedText = (item) => (item.closed !== 0) ? `-${item.closed}` : ''

  return displayPrisons.map((item) => {
    return (
      <div key={item.prisonName}>
        <p onClick={() => selectPrison(item)} className={selectedClassName(item)}>
          {item.prisonName} ({item.opened}{hasClosedText(item)}) - <strong>{item.capacity}</strong>
        </p>
      </div>
    )
  })
}

export default MapIncidents
