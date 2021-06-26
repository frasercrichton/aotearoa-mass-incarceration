
export const INCREMENT_CAPACITY_COUNT = 'INCREMENT_CAPACITY_COUNT'
export const incrementCapacityCount = (payload) => ({
  type: INCREMENT_CAPACITY_COUNT,
  payload
})

export const INCREMENT_CURRENT_DATE = 'INCREMENT_CURRENT_DATE'
export const incrementCurrentDate = () => ({
  type: INCREMENT_CURRENT_DATE
})

export const UPDATE_DISPLAY_PRISONS = 'UPDATE_DISPLAY_PRISONS'
export const updateDisplayPrisons = (payload) => ({
  type: UPDATE_DISPLAY_PRISONS,
  payload
})

export const UPDATE_PRISONS = 'UPDATE_PRISONS'
export const updatePrisons = (payload) => ({
  type: UPDATE_PRISONS,
  payload
})

export const UPDATE_SELECTED_PRISON = 'UPDATE_SELECTED_PRISON'
export const updateSelectedPrison = (payload) => ({
  type: UPDATE_SELECTED_PRISON,
  payload
})

export const RESET_DISPLAY_PRISONS = 'RESET_DISPLAY_PRISONS'
export const resetDisplayPrisons = () => ({
  type: RESET_DISPLAY_PRISONS
})
