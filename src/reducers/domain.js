import {
  INCREMENT_CAPACITY_COUNT,
  UPDATE_CURRENT_DATE,
  UPDATE_DISPLAY_PRISONS,
  UPDATE_PRISONS,
  UPDATE_SELECTED_PRISON
} from '../actions'

const domainInitial = {
  prisons: [],
  displayPrisons: [],
  capacityCount: 0,
  currentDate: 1860,
  selectedPrison: ''
}

const incrementCapacityCount = (state, action) => Object.assign({},
  state,
  { capacityCount: state.capacityCount + action.payload }
)

const updateCurrentDate = (state, action) => Object.assign({},
  state,
  { currentDate: action.payload }
)

const updateDisplayPrisons = (state, action) => {
  console.log('action.payload', action.payload)
  console.log('state.displayPrisons', state.displayPrisons)
  const x = Object.assign({},
    state,
    { displayPrisons: [...state.displayPrisons, action.payload] }
  )
  console.log('state', x)

  return x
}

const updatePrisons = (state, action) => Object.assign({},
  state,
  { prisons: action.payload }
)

const update = (prisons, id) => prisons.map(prison => {
  delete prison.selected
  if (prison.id === id) {
    prison.selected = 'selected'
  }
  return prison
})

const updateSelectedPrison = (state, action) => {
  const x = Object.assign({},
    state,
    {
      selectedPrison: action.payload,
      displayPrisons: update(state.displayPrisons, action.payload)
    }
  )
  console.log('>>>>', x)
  return x
}

const domain = (state = domainInitial, action) => {
  switch (action.type) {
    case INCREMENT_CAPACITY_COUNT:
      return incrementCapacityCount(state, action)
    case UPDATE_CURRENT_DATE:
      return updateCurrentDate(state, action)
    case UPDATE_DISPLAY_PRISONS:
      return updateDisplayPrisons(state, action)
    case UPDATE_PRISONS:
      return updatePrisons(state, action)
    case UPDATE_SELECTED_PRISON:
      return updateSelectedPrison(state, action)
    default:
      return state
  }
}

export default domain
