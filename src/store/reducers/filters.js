import { RESET_FILTERS, SET_FILTER_BY_KEY } from 'store/actions/filters'

export const initialState = {
  language: 'all',
  openToRequests: 'all',
  sortBy: 'match',
  medianGiftMin: null,
  medianGiftMax: null
}

const filterReducer = (state = initialState, { type, payload = {} }) => {
  switch (type) {
    case RESET_FILTERS:
      return { ...initialState }
    case SET_FILTER_BY_KEY:
      const { filter = {} } = payload
      return { ...state, ...filter }
    default:
      return state
  }
}

export default filterReducer
