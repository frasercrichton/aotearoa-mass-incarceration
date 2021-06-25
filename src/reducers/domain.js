import { INCREMENT_CAPACITY_COUNT } from '../actions'

const domainInitial = {
  capacityCount: 0
}

const incrementCapacityCount = (state, action) => Object.assign({},
  state,
  { capacityCount: state.capacityCount + action.payload }
)

const domain = (state = domainInitial, action) => {
  switch (action.type) {
    case INCREMENT_CAPACITY_COUNT:
      return incrementCapacityCount(state, action)
    default:
      return state
  }
}

export default domain
