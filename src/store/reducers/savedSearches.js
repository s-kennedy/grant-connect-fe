import { SET_SAVED_SEARCHES } from 'store/actions/savedSearches'

const initialSaveSearchState = {
  count: 0,
  next: null,
  previous: null,
  results: []
}

const savedSearchesReducer = (state = initialSaveSearchState, { payload, type }) => {
  switch (type) {
    case SET_SAVED_SEARCHES:
      const { data } = payload
      return { ...state, ...data }
    default:
      return state
  }
}

export default savedSearchesReducer
