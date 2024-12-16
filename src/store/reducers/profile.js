import { SET_FUNDER_INFO, SET_FUNDER_INFO_LOADING } from 'store/actions/profile'

const initialState = {
  isLoading: true
}

const funderProfileReducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case SET_FUNDER_INFO_LOADING:
      const { isLoading } = payload
      return { ...state, isLoading }
    case SET_FUNDER_INFO:
      const { data } = payload
      return { ...state, ...data }
    default:
      return state
  }
}

export default funderProfileReducer
