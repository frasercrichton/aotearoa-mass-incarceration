import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { domainState, capacityCountDomainState, currentDateDomainState } from './selectors'
import { updateSelectedPrison } from './actions'

const MapIncidents = () => {
  const dispatch = useDispatch()
  const { displayPrisons } = useSelector(domainState)

  const capacityCount = useSelector(capacityCountDomainState)
  const currentDate = useSelector(currentDateDomainState)

  const selectPrison = (item) => {
    dispatch(updateSelectedPrison(item.id))
  }

  const isClosedClassName = (item) => (item.closed !== 0) ? ' closed' : ''

  const selectedClassName = (item) => {
    return (item.selected) ? 'prison-details active ' + item.prisonName + isClosedClassName(item) : 'prison-details ' + item.prisonName + isClosedClassName(item)
  }

  const hasClosedText = (item) => (item.closed !== 0) ? `-${item.closed}` : ''

  const list = displayPrisons.map((item) => {
    return (
      <div key={item.prisonName}>
        <p onClick={() => selectPrison(item)} className={selectedClassName(item)}>
          {item.prisonName} ({item.opened}{hasClosedText(item)}) - <strong>{item.capacity}</strong>
        </p>
      </div>
    )
  })

  return (
    <div className='metrics-wrapper'>
      <h1>Mass Incarceration</h1>
      <h2>{currentDate}</h2>
      <h2>Population 2021: {capacityCount}</h2>
      <div className='prison-list'>
        {list}
        <div className='references-wrapper'>
          Department of Corrections figures:
          <a
            target='_blank'
            rel='noreferrer'
            href='https://www.corrections.govt.nz/resources/statistics/quarterly_prison_statistics'
          >
            Prison facts and statistics - March 2021
          </a>
        </div>
      </div>
    </div>

  )
}

export default MapIncidents
