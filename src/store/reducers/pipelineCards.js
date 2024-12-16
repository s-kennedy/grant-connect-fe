import { SET_CARD_UPDATING } from 'store/actions/pipelineCards'

const initialState = {
  isCardUpdating: false
}

const pipelineCardReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case SET_CARD_UPDATING:
      const { isCardUpdating } = payload
      return { ...state, isCardUpdating }
    default:
      return state
  }
}

export default pipelineCardReducer
