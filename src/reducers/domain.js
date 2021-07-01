import {
  INCREMENT_CAPACITY_COUNT,
  INCREMENT_CURRENT_DATE,
  RESET_DISPLAY_PRISONS,
  UPDATE_DISPLAY_PRISONS,
  UPDATE_PRISONS,
  UPDATE_SELECTED_PRISON,
  TOGGLE_PLAY_STATE
} from '../actions'

const domainInitial = {
  prisons: [],
  displayPrisons: [],
  capacityCount: 0,
  currentDate: 1860,
  selectedPrison: '',
  playState: true
}

const incrementCapacityCount = (state, action) => Object.assign({},
  state,
  { capacityCount: state.capacityCount + action.payload }
)

const updateDisplayPrisons = (state, action) => {
  return Object.assign({},
    state,
    { displayPrisons: [...state.displayPrisons, action.payload] }
  )
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
  return Object.assign({},
    state,
    {
      selectedPrison: action.payload,
      displayPrisons: update(state.displayPrisons, action.payload)
    }
  )
}

const incrementCurrentDate = (state) => Object.assign({},
  state,
  { currentDate: ++state.currentDate }
)

const resetDisplayPrisons = (state) => Object.assign({},
  state,
  {
    displayPrisons: [],
    capacityCount: 0,
    currentDate: 1860,
  //  selectedPrison selectedPrison: ''
  }
)

const togglePlayState = (state) => Object.assign({},
  state,
  { playState: !state.playState }
)

const domain = (state = domainInitial, action) => {
  switch (action.type) {
    case INCREMENT_CAPACITY_COUNT:
      return incrementCapacityCount(state, action)
    case INCREMENT_CURRENT_DATE:
      return incrementCurrentDate(state, action)
    case UPDATE_DISPLAY_PRISONS:
      return updateDisplayPrisons(state, action)
    case UPDATE_PRISONS:
      return updatePrisons(state, action)
    case UPDATE_SELECTED_PRISON:
      return updateSelectedPrison(state, action)
    case RESET_DISPLAY_PRISONS:
      return resetDisplayPrisons(state)
    case TOGGLE_PLAY_STATE:
      return togglePlayState(state)
    default:
      return state
  }
}

export default domain
