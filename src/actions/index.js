
export const INCREMENT_CAPACITY_COUNT = 'INCREMENT_CAPACITY_COUNT'
export const incrementCapacityCount = (payload) => ({
  type: INCREMENT_CAPACITY_COUNT,
  payload
})

export const UPDATE_CURRENT_DATE = 'UPDATE_CURRENT_DATE'
export const updateCurrentDate = (payload) => ({
  type: UPDATE_CURRENT_DATE,
  payload
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