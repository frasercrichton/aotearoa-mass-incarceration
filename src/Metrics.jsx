import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  domainState,
  capacityCountDomainState,
  currentDateDomainState
} from './selectors'
import { updateSelectedPrison } from './actions'

const hasClosedText = (item) => (item.closed !== 0) ? `-${item.closed}` : ''

const isClosedClassName = (item) => (item.closed !== 0) ? ' closed' : ''

const MapIncidents = () => {
  const dispatch = useDispatch()
  const { displayPrisons } = useSelector(domainState)
  const capacityCount = useSelector(capacityCountDomainState)
  const currentDate = useSelector(currentDateDomainState)
  const selectPrison = (item) => {
    dispatch(updateSelectedPrison(item.id))
  }
  const selectedClassName = (item) => {
    return (item.selected) ? 'prison-details active ' + item.prisonName + isClosedClassName(item) : 'prison-details ' + item.prisonName + isClosedClassName(item)
  }

  const list = displayPrisons.map((item) => {
    return (
      <tr key={item.prisonName} className={selectedClassName(item)}>
        <td onClick={() => selectPrison(item)}>
          {item.prisonName}({item.opened}{hasClosedText(item)})
        </td>
        <td align='right'>          {!item.closed &&
          <strong>{item.capacity}</strong>}
        </td>
      </tr>
    )
  })

  return (
    <div className='metrics-wrapper'>
      <div className='header'>
        <h1>Mass Incarceration</h1>
        <h2>{currentDate}</h2>
      </div>
      <div className='prison-list'>
        <table width='100%'>
          <thead>
            <tr>
              <th align='left' className='prison-header'>Prison</th>
              <th align='right' className='capacity-header'>Current Capacity</th>
            </tr>
          </thead>
          <tbody>
            {list}
            <tr className='population-footer'>
              <td>Total Population:</td>
              <td align='right'>{capacityCount}</td>
            </tr>
          </tbody>
        </table>
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
